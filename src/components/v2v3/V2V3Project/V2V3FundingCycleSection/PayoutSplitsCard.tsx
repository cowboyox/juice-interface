import { SettingOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import { Button, Skeleton, Space, Tooltip } from 'antd'
import { CardSection } from 'components/CardSection'
import SpendingStats from 'components/Project/SpendingStats'
import TooltipLabel from 'components/TooltipLabel'
import SplitList from 'components/v2v3/shared/SplitList'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useETHPaymentTerminalFee } from 'hooks/v2v3/contractReader/ETHPaymentTerminalFee'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2v3/contractReader/V2ConnectedWalletHasPermission'
import { Split } from 'models/splits'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { V2OperatorPermission } from 'models/v2v3/permissions'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { detailedTimeString } from 'utils/format/formatTime'
import { settingsPagePath } from 'utils/routes'
import { V2V3CurrencyName } from 'utils/v2v3/currency'
import { formatFee, MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'
import { reloadWindow } from 'utils/windowUtils'
import DistributePayoutsModal from './modals/DistributePayoutsModal'

export type PayoutSplitsCardProps = {
  hideDistributeButton?: boolean
  payoutSplits: Split[] | undefined
  distributionLimitCurrency: BigNumber | undefined
  distributionLimit: BigNumber | undefined
  fundingCycleDuration: BigNumber | undefined
  value?: JSX.Element
}

export default function PayoutSplitsCard({
  hideDistributeButton,
  payoutSplits,
  distributionLimitCurrency,
  distributionLimit,
  fundingCycleDuration,
  value,
}: PayoutSplitsCardProps) {
  const {
    usedDistributionLimit,
    projectOwnerAddress,
    balanceInDistributionLimitCurrency,
    isPreviewMode,
    loading,
    handle,
  } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const ETHPaymentTerminalFee = useETHPaymentTerminalFee()

  const [distributePayoutsModalVisible, setDistributePayoutsModalVisible] =
    useState<boolean>()
  const isLoadingStats =
    loading.ETHBalanceLoading ||
    loading.distributionLimitLoading ||
    loading.balanceInDistributionLimitCurrencyLoading ||
    loading.usedDistributionLimitLoading

  const formattedDuration = detailedTimeString({
    timeSeconds: fundingCycleDuration?.toNumber(),
    fullWords: true,
  })
  const hasDuration = fundingCycleDuration?.gt(0)
  const canEditPayouts = useV2ConnectedWalletHasPermission(
    V2OperatorPermission.SET_SPLITS,
  )

  const effectiveDistributionLimit = distributionLimit ?? BigNumber.from(0)
  const distributedAmount = usedDistributionLimit ?? BigNumber.from(0)

  const distributable = effectiveDistributionLimit.sub(distributedAmount)

  const distributableAmount = balanceInDistributionLimitCurrency?.gt(
    distributable,
  )
    ? distributable
    : balanceInDistributionLimitCurrency

  const distributeButtonDisabled = isPreviewMode || distributableAmount?.eq(0)

  function DistributeButton(): JSX.Element {
    return (
      <Tooltip
        title={<Trans>No funds available to distribute.</Trans>}
        open={distributeButtonDisabled ? undefined : false}
      >
        <Button
          type="ghost"
          size="small"
          onClick={() => setDistributePayoutsModalVisible(true)}
          disabled={distributeButtonDisabled}
        >
          <Trans>Distribute funds</Trans>
        </Button>
      </Tooltip>
    )
  }

  return (
    <CardSection>
      <Space direction="vertical" size="large" className="w-full">
        {hideDistributeButton ? null : (
          <div className="flex flex-wrap justify-between gap-2">
            <Skeleton
              loading={isLoadingStats}
              active
              title={false}
              paragraph={{ rows: 2, width: ['60%', '60%'] }}
            >
              <SpendingStats
                hasFundingTarget={distributionLimit?.gt(0)}
                currency={V2V3CurrencyName(
                  distributionLimitCurrency?.toNumber() as V2V3CurrencyOption,
                )}
                distributableAmount={distributableAmount}
                targetAmount={distributionLimit ?? BigNumber.from(0)}
                distributedAmount={distributedAmount}
                feePercentage={
                  ETHPaymentTerminalFee
                    ? formatFee(ETHPaymentTerminalFee)
                    : undefined
                }
                ownerAddress={projectOwnerAddress}
              />
            </Skeleton>

            <div>
              <DistributeButton />
            </div>
          </div>
        )}

        <div>
          <div className="flex flex-wrap justify-between gap-2">
            <TooltipLabel
              label={
                <h3 className="inline-block text-sm uppercase text-black dark:text-slate-100">
                  <Trans>Funding distribution</Trans>
                </h3>
              }
              tip={
                <Trans>
                  Available funds can be distributed according to the payouts
                  below
                  {hasDuration ? ` every ${formattedDuration}` : null}.
                </Trans>
              }
            />
            {canEditPayouts && (
              <Link href={settingsPagePath('payouts', { projectId, handle })}>
                <Button
                  className="mb-4"
                  size="small"
                  icon={<SettingOutlined />}
                >
                  <span>
                    <Trans>Edit payouts</Trans>
                  </span>
                </Button>
              </Link>
            )}
          </div>
          {payoutSplits ? (
            <>
              {value ?? (
                <SplitList
                  splits={payoutSplits}
                  currency={distributionLimitCurrency}
                  totalValue={distributionLimit}
                  projectOwnerAddress={projectOwnerAddress}
                  showAmounts={!distributionLimit?.eq(MAX_DISTRIBUTION_LIMIT)}
                  valueFormatProps={{ precision: 4 }}
                />
              )}
            </>
          ) : (
            <span className="text-grey-500 dark:text-slate-100">
              <Trans>This project has no distributions.</Trans>
            </span>
          )}
        </div>
      </Space>

      <DistributePayoutsModal
        open={distributePayoutsModalVisible}
        onCancel={() => setDistributePayoutsModalVisible(false)}
        onConfirmed={reloadWindow}
      />
    </CardSection>
  )
}
