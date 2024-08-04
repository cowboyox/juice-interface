import { Trans } from '@lingui/macro'
import { useWatch } from 'antd/lib/form/Form'
import { SPLITS_TOTAL_PERCENT } from 'packages/v2v3/utils/math'
import { totalSplitsPercent } from 'packages/v2v3/utils/v2v3Splits'
import { useEditCycleFormContext } from '../EditCycleFormContext'

export function useEditCycleFormHasError() {
  const { editCycleForm } = useEditCycleFormContext()

  const payoutSplits = useWatch('payoutSplits', editCycleForm) ?? []
  const reservedSplits = useWatch('reservedSplits', editCycleForm) ?? []

  const payoutSplitsPercentExceedsMax =
    totalSplitsPercent(payoutSplits) > SPLITS_TOTAL_PERCENT
  const reservedSplitsPercentExceedsMax =
    totalSplitsPercent(reservedSplits) > SPLITS_TOTAL_PERCENT

  let error: JSX.Element | undefined

  if (payoutSplitsPercentExceedsMax && reservedSplitsPercentExceedsMax) {
    error = (
      <Trans>Payout and reserved token recipients cannot exceed 100%</Trans>
    )
  } else if (payoutSplitsPercentExceedsMax) {
    error = <Trans>Payouts cannot exceed 100%</Trans>
  } else if (reservedSplitsPercentExceedsMax) {
    error = <Trans>Reserved token recipients cannot exceed 100%</Trans>
  }

  return {
    error,
  }
}
