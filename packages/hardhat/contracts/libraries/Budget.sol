// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./Math.sol";

/// @notice Budget data and logic.
library Budget {
    using SafeMath for uint256;

    /// @notice Possible states that a Budget may be in
    /// @dev Budget's are immutable once they are active.
    enum State {Standby, Active, Redistributing}

    /// @notice The Budgets structure represents a project stewarded by an address, and accounts for which addresses have helped sustain the project.
    struct Data {
        // A unique number that's incremented for each new Budget, starting with 1.
        uint256 id;
        // The address who defined this Budget and who has access to its funds.
        address project;
        // The number of this budget for the project.
        uint256 number;
        // The ID of the project's Budget that came before this one. 0 if none.
        uint256 previous;
        // The ID of the project's Budget that came after this one. 0 if none.
        uint256 next;
        // The name of the budget.
        string name;
        // A link that points to a justification for these parameters.
        string link;
        // The amount that this Budget is targeting.
        uint256 target;
        // The currency that the target is measured in.
        uint256 currency;
        // The running amount that's been paid to this Budget.
        uint256 total;
        // The time when this Budget will become active.
        uint256 start;
        // The number of seconds until this Budget's surplus is redistributed.
        uint256 duration;
        // The amount of available funds that have been tapped by the project in terms of the currency.
        uint256 tappedTarget;
        // The amount of available funds that have been tapped by the project in terms of eth.
        uint256 tappedTotal;
        // The percentage of tickets to reserve for the project once the Budget has expired.
        uint256 p;
        // The percentage of overflow to reserve for a specified beneficiary once the Budget has expired.
        uint256 b;
        // The specified beneficiary.
        address bAddress;
        // A number determining the amount of redistribution shares this Budget will issue to each sustainer.
        uint256 weight;
        // A number indicating how much more weight to give a Budget compared to its predecessor.
        uint256 discountRate;
        // The time when this Budget was last configured.
        uint256 configured;
    }

    // --- internal transactions --- //

    /**
        @notice Clones the properties from the base Budget.
        @dev The base must be the Budget directly preceeding self.
        @param _self The Budget to clone onto.
        @param _baseBudget The Budget to clone from.
    */
    function _basedOn(Data storage _self, Data memory _baseBudget) internal {
        _self.link = _baseBudget.link;
        _self.target = _baseBudget.target;
        _self.currency = _baseBudget.currency;
        _self.duration = _baseBudget.duration;
        _self.project = _baseBudget.project;
        _self.name = _baseBudget.name;
        _self.discountRate = _baseBudget.discountRate;
        _self.weight = _derivedWeight(_baseBudget);
        _self.p = _baseBudget.p;
        _self.b = _baseBudget.b;
        _self.bAddress = _baseBudget.bAddress;
        _self.configured = _baseBudget.configured;
        _self.number = _baseBudget.number.add(1);
        _self.previous = _baseBudget.id;
    }

    // --- internal views --- //

    /** 
        @notice The state the Budget is in.
        @param _self The Budget to get the state of.
        @return state The state.
    */
    function _state(Data memory _self) internal view returns (State) {
        if (_hasExpired(_self)) return State.Redistributing;
        if (_hasStarted(_self) && _self.total > 0) return State.Active;
        return State.Standby;
    }

    /** 
        @notice The date that is the nearest multiple of duration from oldEnd.
        @param _self The Budget to make the calculation for.
        @return start The date.
    */
    function _determineNextStart(Data memory _self)
        internal
        view
        returns (uint256)
    {
        uint256 _end = _self.start.add(_self.duration);
        // Use the old end if the current time is still within the duration.
        if (_end.add(_self.duration) > block.timestamp) return _end;
        // Otherwise, use the closest multiple of the duration from the old end.
        uint256 _distanceToStart =
            (block.timestamp.sub(_end)).mod(_self.duration);
        return block.timestamp.sub(_distanceToStart);
    }

    /** 
        @notice A view of the Budget that would be created after this one if the project doesn't make a reconfiguration.
        @param _self The Budget to make the calculation for.
        @return _budget The next Budget, with an ID set to 0.
    */
    function _nextUp(Data memory _self) internal view returns (Data memory) {
        return
            Data(
                0,
                _self.project,
                _self.number.add(1),
                _self.id,
                0,
                _self.name,
                _self.link,
                _self.target,
                _self.currency,
                0,
                _determineNextStart(_self),
                _self.duration,
                0,
                0,
                _self.p,
                _self.b,
                _self.bAddress,
                _derivedWeight(_self),
                _self.discountRate,
                _self.configured
            );
    }

    /** 
        @notice The weight derived from the current weight and the discountRate.
        @param _self The Budget to make the calculation for.
        @return _weight The new weight.
    */
    function _derivedWeight(Data memory _self) internal pure returns (uint256) {
        return _self.weight.mul(_self.discountRate).div(100);
    }

    /** 
        @notice The weight that a certain amount carries in this Budget.
        @param _self The Budget to get the weight from.
        @param _amount The amount to get the weight of in the same currency as the budget's currency.
        @param _percentage The percentage to account for.
        @return state The weighted amount.
    */
    function _weighted(
        Data memory _self,
        uint256 _amount,
        uint256 _percentage
    ) internal pure returns (uint256) {
        return
            _self.weight.mul(_amount).mul(_percentage).div(_self.target).div(
                100
            );
    }

    // --- private views --- //

    /** 
        @notice Check to see if the given Budget has started.
        @param _self The Budget to check.
        @return hasStarted The boolean result.
    */
    function _hasStarted(Data memory _self) private view returns (bool) {
        return block.timestamp >= _self.start;
    }

    /** 
        @notice Check to see if the given Budget has expired.
        @param _self The Budget to check.
        @return hasExpired The boolean result.
    */
    function _hasExpired(Data memory _self) private view returns (bool) {
        return block.timestamp > _self.start.add(_self.duration);
    }
}
