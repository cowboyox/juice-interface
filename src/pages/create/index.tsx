import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import { Head } from 'components/common/Head/Head'
import { CV_V3 } from 'constants/cv'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { OPEN_IPFS_GATEWAY_HOSTNAME } from 'constants/ipfs'
import { NETWORKS_BY_NAME } from 'constants/networks'
import { SiteBaseUrl } from 'constants/url'
import { TransactionProvider } from 'contexts/Transaction/TransactionProvider'
import { JBProjectProvider } from 'juice-sdk-react'
import { NetworkName } from 'models/networkName'
import { Create as V2V3Create } from 'packages/v2v3/components/Create/Create'
import { V2V3ContractsProvider } from 'packages/v2v3/contexts/Contracts/V2V3ContractsProvider'
import { V2V3CurrencyProvider } from 'packages/v2v3/contexts/V2V3CurrencyProvider'
import { Create as V4Create } from 'packages/v4/components/Create/Create'
import { wagmiConfig } from 'packages/v4/wagmiConfig'
import { Provider } from 'react-redux'
import store from 'redux/store'
import { featureFlagEnabled } from 'utils/featureFlags'
import globalGetServerSideProps from 'utils/next-server/globalGetServerSideProps'
import { WagmiProvider } from 'wagmi'

export default function CreatePage() {
  let contentByVersion = (
    <V2V3ContractsProvider initialCv={CV_V3}>
      <TransactionProvider>
        <V2V3CurrencyProvider>
          <V2V3Create />
        </V2V3CurrencyProvider>
      </TransactionProvider>
    </V2V3ContractsProvider>
  )

  if (featureFlagEnabled(FEATURE_FLAGS.V4)) {
    contentByVersion = (
      <WagmiProvider config={wagmiConfig}>
        {/* Hardcode V4 create to Sepoila for now */}
        <JBProjectProvider
          chainId={NETWORKS_BY_NAME[NetworkName.sepolia].chainId as 11155111}
          projectId={1n}
          ctxProps={{
            metadata: { ipfsGatewayHostname: OPEN_IPFS_GATEWAY_HOSTNAME },
          }}
        >
          <V4Create />
        </JBProjectProvider>
      </WagmiProvider>
    )
  }
  return (
    <>
      <Head
        title="Create your project"
        url={SiteBaseUrl + '/create'}
        description="Launch a project on Juicebox"
      />

      <AppWrapper>
        <Provider store={store}>
          {contentByVersion}
        </Provider>
      </AppWrapper>
    </>
  )
}

export const getServerSideProps = globalGetServerSideProps
