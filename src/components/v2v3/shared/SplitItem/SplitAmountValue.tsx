import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import ETHToUSD from 'components/currency/ETHToUSD'
import CurrencySymbol from 'components/CurrencySymbol'
import { Parenthesis } from 'components/Parenthesis'
import { useETHPaymentTerminalFee } from 'hooks/v2v3/contractReader/ETHPaymentTerminalFee'
import { Split } from 'models/splits'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { formatWad } from 'utils/format/formatNumber'
import { V2V3CurrencyName } from 'utils/v2v3/currency'
import { isJuiceboxProjectSplit } from 'utils/v2v3/distributions'
import { feeForAmount, SPLITS_TOTAL_PERCENT } from 'utils/v2v3/math'

export function SplitAmountValue({
  split,
  totalValue,
  valueSuffix,
  valueFormatProps,
  currency,
  showFees = false,
}: {
  split: Split
  totalValue: BigNumber | undefined
  valueSuffix?: string | JSX.Element
  valueFormatProps?: { precision?: number }
  currency?: BigNumber
  showFees?: boolean
}) {
  const ETHPaymentTerminalFee = useETHPaymentTerminalFee()
  const splitValue = totalValue?.mul(split.percent).div(SPLITS_TOTAL_PERCENT)
  const isJuiceboxProject = isJuiceboxProjectSplit(split)
  const feeAmount = !isJuiceboxProject
    ? feeForAmount(splitValue, ETHPaymentTerminalFee)
    : BigNumber.from(0)
  const splitValueFormatted =
    splitValue &&
    feeAmount &&
    formatWad(splitValue.sub(feeAmount), {
      ...valueFormatProps,
    })
  const feeAmountFormatted = formatWad(feeAmount, {
    ...valueFormatProps,
  })

  const curr = V2V3CurrencyName(
    currency?.toNumber() as V2V3CurrencyOption | undefined,
  )
  const tooltipTitle =
    curr === 'ETH' && splitValue?.gt(0) ? (
      <ETHToUSD ethAmount={splitValue} />
    ) : undefined

  return (
    <Tooltip title={tooltipTitle}>
      <span>
        (
        <CurrencySymbol currency={curr} />
        {splitValueFormatted}
        {valueSuffix ? <span> {valueSuffix}</span> : null})
      </span>
      <div className="ml-2 text-sm text-grey-500 dark:text-grey-300">
        {showFees && !isJuiceboxProject && (
          <Parenthesis>
            <Trans>
              <CurrencySymbol currency={curr} />
              {feeAmountFormatted} fee
            </Trans>
          </Parenthesis>
        )}
      </div>
    </Tooltip>
  )
}
