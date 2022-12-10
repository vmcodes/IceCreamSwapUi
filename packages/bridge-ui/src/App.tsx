import React from 'react'
import { init, ErrorBoundary, showReportDialog } from '@sentry/react'
import { ThemeSwitcher } from '@chainsafe/common-theme'
import { lightTheme } from './themes/LightTheme'
import { ChainbridgeProvider, NetworkManagerProvider, LocalProvider } from '@icecreamswap/bridge-ui-core'
import { AppWrapper } from './layouts'
import { ChainbridgeConfig, chainbridgeConfig, UIConfig } from './chainbridgeConfig'
import { utils } from 'ethers'
import '@chainsafe/common-theme/dist/font-faces.css'
import { TransferPage } from './pages'
import { CssBaseline } from '@chainsafe/common-components'

if (
  process.env.NODE_ENV === 'production' &&
  process.env.REACT_APP_SENTRY_DSN_URL &&
  process.env.REACT_APP_SENTRY_RELEASE
) {
  init({
    dsn: process.env.REACT_APP_SENTRY_DSN_URL,
    release: process.env.REACT_APP_SENTRY_RELEASE,
  })
}

interface AppProps {
  config: {
    UI: UIConfig
    CHAINBRIDGE: ChainbridgeConfig
    INDEXER_URL: string
  }
}

const App: React.FC<AppProps> = ({ config }) => {
  const {
    UI: { wrapTokenPage = false } = {},
    CHAINBRIDGE: { chains },
  } = config

  const tokens = chainbridgeConfig.chains
    .filter((c) => c.type === 'Ethereum')
    .reduce((tca, bc: any) => {
      if (bc.networkId) {
        return {
          ...tca,
          [bc.networkId]: bc.tokens,
        }
      } else {
        return tca
      }
    }, {})

  return (
    // @ts-ignore
    <ErrorBoundary
      fallback={({ error, componentStack, eventId, resetError }) => (
        <div>
          <p>
            An error occurred and has been logged. If you would like to provide additional info to help us debug and
            resolve the issue, click the "Provide Additional Details" button
          </p>
          <p>{error?.message.toString()}</p>
          <p>{componentStack}</p>
          <p>{eventId}</p>
          <button onClick={() => showReportDialog({ eventId: eventId || '' })}>Provide Additional Details</button>
          <button onClick={resetError}>Reset error</button>
        </div>
      )}
      onReset={() => window.location.reload()}
    >
      <ThemeSwitcher themes={{ light: lightTheme }}>
        <CssBaseline />
        <LocalProvider
          networkIds={[5]}
          checkNetwork={false}
          tokensToWatch={tokens}
          onboardConfig={{
            walletSelect: {
              wallets: [{ walletName: 'metamask', preferred: true }],
            },
            subscriptions: {
              network: (network: any) => network && console.log('domainId: ', network),
              balance: (amount: any) => amount && console.log('balance: ', utils.formatEther(amount)),
            },
          }}
        >
          <NetworkManagerProvider>
            <ChainbridgeProvider chains={chains}>
              <TransferPage />
            </ChainbridgeProvider>
          </NetworkManagerProvider>
        </LocalProvider>
      </ThemeSwitcher>
    </ErrorBoundary>
  )
}

export default App
