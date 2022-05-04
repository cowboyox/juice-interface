import { Col, Row, Space } from 'antd'
import PayInputGroup from 'components/shared/inputs/Pay/PayInputGroup'
import ProjectHeader from 'components/shared/ProjectHeader'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import { useContext, useState } from 'react'

import { decodeV2FundingCycleMetadata } from 'utils/v2/fundingCycle'

import { weightedAmount } from 'utils/v2/math'
import { useHistory, useLocation } from 'react-router-dom'

import V2PayButton from './V2PayButton'
import V2ProjectHeaderActions from './V2ProjectHeaderActions'
import TreasuryStats from './TreasuryStats'
import V2FundingCycleSection from './V2FundingCycleSection'
import V2ManageTokensSection from './V2ManageTokensSection'
import NewDeployModal from './NewDeployModal'

const GUTTER_PX = 40

export default function V2Project({
  singleColumnLayout,
  expandFundingCycleCard,
}: {
  singleColumnLayout?: boolean
  expandFundingCycleCard?: boolean
}) {
  const { projectId, projectMetadata, fundingCycle, isPreviewMode } =
    useContext(V2ProjectContext)

  // Checks URL to see if user was just directed from project deploy
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const isNewDeploy = Boolean(params.get('newDeploy'))

  const history = useHistory()

  const [newDeployModalVisible, setNewDeployModalVisible] =
    useState<boolean>(isNewDeploy)

  const colSizeMd = singleColumnLayout ? 24 : 12

  if (!projectId) return null

  const fundingCycleMetadata = fundingCycle
    ? decodeV2FundingCycleMetadata(fundingCycle?.metadata)
    : undefined

  const closeNewDeployModal = () => {
    // Change URL without refreshing page
    history.replace(`/v2/p/${projectId}`)
    setNewDeployModalVisible(false)
  }

  return (
    <Space direction="vertical" size={GUTTER_PX} style={{ width: '100%' }}>
      <ProjectHeader
        metadata={projectMetadata}
        actions={!isPreviewMode ? <V2ProjectHeaderActions /> : undefined}
      />
      <Row gutter={GUTTER_PX} align="bottom">
        <Col md={colSizeMd} xs={24}>
          <TreasuryStats />
        </Col>
        <Col md={colSizeMd} xs={24} style={{ marginTop: GUTTER_PX }}>
          <PayInputGroup
            PayButton={V2PayButton}
            reservedRate={fundingCycleMetadata?.reservedRate.toNumber()}
            weight={fundingCycle?.weight}
            weightingFn={weightedAmount}
          />
        </Col>
      </Row>
      <Row gutter={GUTTER_PX}>
        <Col md={colSizeMd} xs={24}>
          <Space
            direction="vertical"
            size={GUTTER_PX}
            style={{ width: '100%' }}
          >
            {/* TODO volume chart */}
            <V2ManageTokensSection />
            <V2FundingCycleSection expandCard={expandFundingCycleCard} />
          </Space>
        </Col>
      </Row>
      <NewDeployModal
        visible={newDeployModalVisible}
        onClose={closeNewDeployModal}
      />
    </Space>
  )
}
