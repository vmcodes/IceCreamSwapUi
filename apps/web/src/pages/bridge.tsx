import { Spinner } from '@pancakeswap/uikit'
import dynamic from 'next/dynamic'
import { useLayoutEffect } from 'react'
import bridgeConfig from '../../public/bridge-config.json'

const BridgeApp = dynamic(async () => (await import('@icecreamswap/bridge-ui')).App, {
  ssr: false,
  loading: () => <Spinner />,
})

const Bridge = () => {
  useLayoutEffect(() => {
    // @ts-ignore
    window.__RUNTIME_CONFIG__ = bridgeConfig
  }, [])

  if (typeof window !== 'undefined') {
    return <BridgeApp config={bridgeConfig} />
  }
  return <Spinner />
}

export default Bridge
