import { BigNumber } from '@ethersproject/bignumber'
import { Space } from 'antd'
import { CardSection } from 'components/shared/CardSection'
import TooltipLabel from 'components/shared/TooltipLabel'
import { ThemeOption } from 'constants/theme/theme-option'
import { ThemeContext } from 'contexts/themeContext'
import { FundingCycle } from 'models/funding-cycle'
import { PayoutMod, TicketMod } from 'models/mods'
import { useContext, useState } from 'react'

import CurrentFundingCycle from './CurrentFundingCycle'
import FundingHistory from './FundingHistory'
import QueuedFundingCycle from './QueuedFundingCycle'

type TabOption = 'current' | 'upcoming' | 'history'

export default function FundingCycles({
  projectId,
  fundingCycle,
  payoutMods,
  ticketMods,
  tokenSymbol,
  balanceInCurrency,
  showCurrentDetail,
  isOwner,
}: {
  projectId: BigNumber
  fundingCycle: FundingCycle | undefined
  payoutMods: PayoutMod[] | undefined
  ticketMods: TicketMod[] | undefined
  tokenSymbol: string | undefined
  balanceInCurrency: BigNumber | undefined
  showCurrentDetail?: boolean
  isOwner?: boolean
}) {
  const [selectedTab, setSelectedTab] = useState<TabOption>('current')
  const [hoverTab, setHoverTab] = useState<TabOption>()

  const {
    theme: { colors },
    forThemeOption,
  } = useContext(ThemeContext)

  const tab = (option: TabOption) => (
    <div
      style={{
        textTransform: 'uppercase',
        cursor: 'pointer',
        ...(option === selectedTab
          ? { color: colors.text.secondary, fontWeight: 600 }
          : { color: colors.text.tertiary, fontWeight: 500 }),
        ...(option === hoverTab ? { color: colors.text.secondary } : {}),
      }}
      onClick={() => setSelectedTab(option)}
      onMouseEnter={() => setHoverTab(option)}
      onMouseLeave={() => setHoverTab(undefined)}
    >
      {option}
    </div>
  )

  let tabContent: JSX.Element

  switch (selectedTab) {
    case 'current':
      tabContent = (
        <CurrentFundingCycle
          projectId={projectId}
          fundingCycle={fundingCycle}
          payoutMods={payoutMods}
          ticketMods={ticketMods}
          balanceInCurrency={balanceInCurrency}
          showCurrentDetail={showCurrentDetail}
          isOwner={isOwner}
          tokenSymbol={tokenSymbol}
        />
      )
      break
    case 'upcoming':
      tabContent = (
        <QueuedFundingCycle
          isOwner={isOwner}
          projectId={projectId}
          currentCycle={fundingCycle}
          tokenSymbol={tokenSymbol}
        />
      )
      break
    case 'history':
      tabContent = (
        <CardSection padded>
          <FundingHistory startId={fundingCycle?.basedOn} />
        </CardSection>
      )
      break
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <TooltipLabel
          style={{
            color: colors.text.header,
            fontWeight:
              forThemeOption &&
              forThemeOption({
                [ThemeOption.light]: 600,
                [ThemeOption.dark]: 400,
              }),
          }}
          label="Funding cycle"
          tip="A project's lifetime is defined in funding cycles. If a funding target is set, the project can withdraw no more than the target for the duration of the cycle."
        />
        <Space style={{ fontSize: '.8rem' }} size="middle">
          {tab('current')}
          {tab('upcoming')}
          {tab('history')}
        </Space>
      </div>
      <div>{tabContent}</div>
    </div>
  )
}
