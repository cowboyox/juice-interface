const shouldBehaveLike = require("./behaviors");

const contractName = "Tickets";

module.exports = function() {
  // Before the tests, deploy mocked dependencies and the contract.
  before(async function() {
    // Deploy mock dependency contracts.
    this.projects = await this.deployMockLocalContract("Projects");
    this.operatorStore = await this.deployMockLocalContract("OperatorStore");
    this.juiceTerminalDirectory = await this.deployMockLocalContract(
      "JuiceTerminalDirectory"
    );

    // Deploy the contract.
    this.contract = await this.deployContract(contractName, [
      this.projects.address,
      this.operatorStore.address,
      this.juiceTerminalDirectory.address
    ]);
  });

  // Test each function.
  describe("issue(...)", shouldBehaveLike.issue);
  describe("print(...)", shouldBehaveLike.print);
  describe("unstake(...)", shouldBehaveLike.unstake);
  describe("stake(...)", shouldBehaveLike.stake);
  describe("transfer(...)", shouldBehaveLike.transfer);
  describe("redeem(...)", shouldBehaveLike.redeem);
  // describe("transferController(...)", shouldBehaveLike.transferController);
  describe("lock(...)", shouldBehaveLike.lock);
  describe("unlock(...)", shouldBehaveLike.unlock);
  describe("balanceOf(...)", shouldBehaveLike.balanceOf);
  describe("totalSupply(...)", shouldBehaveLike.totalSupply);
};
