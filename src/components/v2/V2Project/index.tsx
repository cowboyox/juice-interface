import { Col, Row } from 'antd'
import PayInputGroup from 'components/shared/inputs/Pay/PayInputGroup'
import ProjectHeader from 'components/shared/ProjectHeader'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useContext } from 'react'

import { permilleToPercent } from 'utils/formatNumber'
import { fromWad } from 'utils/formatNumber'
import {
  deserializeV2FundingCycleMetadata,
  serializeV2FundingCycleMetadata,
} from 'utils/v2/serializers'

import V2PayButton from './V2PayButton'

export default function V2Project() {
  const {
    projectId,
    projectMetadata,
    fundingCycle,
    payoutSplits,
    reserveTokenSplits,
    ETHBalance,
  } = useContext(V2ProjectContext)

  if (!projectId) return null

  const start = fundingCycle?.start
    ? new Date(fundingCycle?.start?.mul(1000).toNumber())
    : null

  const end =
    fundingCycle?.start && fundingCycle?.duration
      ? new Date(
          fundingCycle?.start.add(fundingCycle?.duration).mul(1000).toNumber(),
        )
      : null

  const reservedRate = 0 // todo get this from v2fundingcyclemetadata
  const weight = fundingCycle?.weight
  return (
    <>
      <Row>
        <ProjectHeader metadata={projectMetadata} />
      </Row>
      <Row>
        <Col md={12} xs={24}>
          <h2>In Juicebox: {fromWad(ETHBalance)}</h2>

          {fundingCycle && (
            <div>
              <h2>Funding Cycle details</h2>
              <ul>
                <li>FC#{fundingCycle?.number.toNumber()}</li>
                <li>
                  Discount rate: {permilleToPercent(fundingCycle.discountRate)}%
                </li>
                <li>Start: {start?.toISOString()}</li>
                <li>End: {end?.toISOString()}</li>
                <li>Weight: {fundingCycle.weight.toString()}</li>
                <li>Metadata: {fundingCycle?.metadata.toString()}</li>
              </ul>

              <h3>ETH payouts</h3>
              <ul>
                {payoutSplits?.map(split => (
                  <li>{split.beneficiary}</li>
                ))}
              </ul>

              <h3>Reserve token allocation</h3>
              <ul>
                {reserveTokenSplits?.map(split => (
                  <li>{split.beneficiary}</li>
                ))}
              </ul>
            </div>
          )}
        </Col>
        <Col md={12} xs={24}>
          <PayInputGroup
            PayButton={V2PayButton}
            reservedRate={reservedRate}
            weight={weight}
          />
        </Col>
      </Row>
    </>
  )
}
