import { t } from '@lingui/macro'
import { Row } from 'antd'
import FormattedAddress from 'components/FormattedAddress'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { featureFlagEnabled } from 'utils/featureFlags'
import { DescriptionCol } from '../DescriptionCol'
import { useRulesReview } from './hooks/RulesReview'

export const MobileRulesReview = () => {
  const {
    customAddress,
    pausePayments,
    strategy,
    terminalConfiguration,
    holdFees,
    useDataSourceForRedeem,
    preventOverspending,
  } = useRulesReview()

  const delegateV1_1Enabled = featureFlagEnabled(FEATURE_FLAGS.DELEGATE_V1_1)

  return (
    <Row gutter={[20, 20]}>
      <DescriptionCol
        span={12}
        title={t`Reconfiguration`}
        desc={
          <div className="text-base font-medium">
            {strategy ? (
              strategy
            ) : customAddress ? (
              <FormattedAddress address={customAddress} />
            ) : (
              '??'
            )}
          </div>
        }
      />
      <DescriptionCol
        span={12}
        title={t`Pause payments`}
        desc={<div className="text-base font-medium">{pausePayments}</div>}
      />
      <DescriptionCol
        span={12}
        title={t`Terminal configuration`}
        desc={
          <div className="text-base font-medium">{terminalConfiguration}</div>
        }
      />
      <DescriptionCol
        span={12}
        title={t`Hold fees`}
        desc={<div className="text-base font-medium">{holdFees}</div>}
      />
      <DescriptionCol
        span={12}
        title={t`Use data source for redeem`}
        desc={
          <div className="text-base font-medium">{useDataSourceForRedeem}</div>
        }
      />
      {delegateV1_1Enabled ? (
        <DescriptionCol
          span={12}
          title={t`Prevent NFT overspending`}
          desc={
            <div className="text-base font-medium">{preventOverspending}</div>
          }
        />
      ) : null}
    </Row>
  )
}
