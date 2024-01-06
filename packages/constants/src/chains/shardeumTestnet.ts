import { FACTORY_ADDRESS, INIT_CODE_HASH } from '../common/swap'
import IceChain from '../ice-chain'

export const shardeumTestnet: IceChain = {
  id: 8082,
  name: 'Shardeum(Testnet)',
  features: ['swap'],
  network: 'shardeumTestnet',
  rpcUrls: {
    public: 'https://sphinx.shardeum.org',
    default: 'https://sphinx.shardeum.org',
  },
  blockExplorers: {
    default: { name: 'Shardeum(Testnet) Explorer', url: 'http://45.33.7.22:6001' },
  },
  nativeCurrency: {
    name: 'Shardeum',
    symbol: 'SHM',
    decimals: 18,
  },
  multicall: {
    address: '0xBD2e577dEa54602C7c367fa144981c8ACA6FD570',
    blockCreated: 4015,
  },
  blockInterval: 60,
  wrappedNative: {
    address: '0xBb5e1777A331ED93E07cF043363e48d320eb96c4',
    decimals: 18,
    symbol: 'WSHM',
    name: 'Wrapped Shardeum',
  },
  swap: {
    factoryAddress: FACTORY_ADDRESS,
    initCodeHash: INIT_CODE_HASH,
  },
}
