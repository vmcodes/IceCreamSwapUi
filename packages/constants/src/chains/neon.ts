import { FACTORY_ADDRESS, INIT_CODE_HASH } from '../common/swap'
import IceChain from '../ice-chain'

export const neon: IceChain = {
  id: 245022934,
  name: 'Neon EVM Blockchain',
  features: ['swap', 'farms'],
  network: 'neon',
  rpcUrls: {
    public: 'https://neon-proxy-mainnet.solana.p2p.org',
    default: 'https://neon-proxy-mainnet.solana.p2p.org',
  },
  blockExplorers: {
    default: { name: 'Neon EVM Explorer', url: 'https://neonscan.org/' },
  },
  nativeCurrency: {
    name: 'Neon EVM',
    symbol: 'NEON',
    decimals: 18,
  },
  multicall: {
    address: '0xf3a3daf360161b2f10c645ef039c709a3fd4ea62',
    blockCreated: 236956242,
  },
  blockInterval: 0.4,
  wrappedNative: {
    address: '0x202c35e517fa803b537565c40f0a6965d7204609',
    decimals: 18,
    symbol: 'WNEON',
    name: 'Wrapped NEON',
  },
  swap: {
    factoryAddress: FACTORY_ADDRESS,
    initCodeHash: INIT_CODE_HASH,
  },
}
