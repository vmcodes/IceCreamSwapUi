import { Bridge } from '@chainsafe/chainbridge-contracts'
import { providers, BigNumber, utils, constants as ethers_constants } from 'ethers'
import { decodeAddress } from '@polkadot/util-crypto'
import { Erc20DetailedFactory } from '../../../Contracts/Erc20DetailedFactory'
import { TransactionStatus } from '../../NetworkManagerContext'

import { chainbridgeConfig, BridgeConfig } from '../../../chainbridgeConfig'

import { getPriceCompatibility } from './helpers'

const makeDeposit =
  (
    setTransactionStatus: (message: TransactionStatus | undefined) => void,
    setDepositNonce: (input: string | undefined) => void,
    setHomeTransferTxHash: (input: string) => void,
    setDepositAmount: (input: number | undefined) => void,
    setSelectedToken: (tokenAddress: string) => void,
    gasPrice: number,

    homeChainConfig?: BridgeConfig,
    homeBridge?: Bridge,
    provider?: providers.Web3Provider,
    address?: string,
    bridgeFee?: number,
    bridgeFeeToken?: string,
  ) =>
  async (amount: number, recipient: string, tokenAddress: string, destinationChainId: number) => {
    if (!homeChainConfig || !homeBridge) {
      console.error('Home bridge contract is not instantiated')
      return
    }
    const signer = provider?.getSigner()
    if (!address || !signer) {
      console.log('No signer')
      return
    }

    const destinationChain = chainbridgeConfig.chains.find((c) => c.domainId === destinationChainId)
    // TODO: create separate version for substrate
    if (destinationChain?.type === 'Substrate') {
      recipient = `0x${Buffer.from(decodeAddress(recipient)).toString('hex')}`
    }
    const token = homeChainConfig.tokens.find((token) => token.address === tokenAddress)

    if (!token) {
      console.log('Invalid token selected')
      return
    }

    setTransactionStatus('Initializing Transfer')
    setDepositAmount(amount)
    setSelectedToken(tokenAddress)
    const erc20 = Erc20DetailedFactory.connect(tokenAddress, signer)
    const isNative = token.address == '0x0000000000000000000000000000000000000000'

    const erc20Decimals = token.decimals || (isNative ? 18 : await erc20.decimals())

    const amountBN = BigNumber.from(utils.parseUnits(amount.toString(), erc20Decimals))

    const data =
      '0x' +
      utils.hexZeroPad(amountBN.toHexString(), 32).substr(2) + // Deposit Amount (32 bytes)
      utils.hexZeroPad(utils.hexlify((recipient.length - 2) / 2), 32).substr(2) + // len(recipientAddress) (32 bytes)
      recipient.substr(2) // recipientAddress (?? bytes)

    try {
      const gasPriceCompatibility = await getPriceCompatibility(provider, homeChainConfig, gasPrice)

      const handlerAddress = await homeBridge._resourceIDToHandlerAddress(token.resourceId)
      const currentAllowance = isNative ? 0 : await erc20.allowance(address, handlerAddress)
      console.log('🚀  currentAllowance', utils.formatUnits(currentAllowance, erc20Decimals))
      // TODO extract token allowance logic to separate function
      if (!isNative && Number(utils.formatUnits(currentAllowance, erc20Decimals)) < amount) {
        if (Number(utils.formatUnits(currentAllowance, erc20Decimals)) > 0 && token.isDoubleApproval) {
          //We need to reset the user's allowance to 0 before we give them a new allowance
          setTransactionStatus('Approve 0')
          await (
            await erc20.approve(handlerAddress, BigNumber.from(utils.parseUnits('0', erc20Decimals)), {
              gasPrice: gasPriceCompatibility,
            })
          ).wait(1)
        }
        setTransactionStatus('Approve')
        await (
          await erc20.approve(
            handlerAddress,
            ethers_constants.MaxUint256, // BigNumber.from(utils.parseUnits(amount.toString(), erc20Decimals)),
            {
              gasPrice: gasPriceCompatibility,
            },
          )
        ).wait(1)
      }

      setTransactionStatus('Deposit')

      let value = BigNumber.from(0)
      if (isNative) {
        value = amountBN
      } else {
        if (bridgeFee && bridgeFeeToken == '0x0000000000000000000000000000000000000000') {
          value = utils.parseUnits(bridgeFee.toString(), 18)
        }
      }

      const depositTransaction = await homeBridge.deposit(destinationChainId, token.resourceId, data, {
        gasPrice: gasPriceCompatibility,
        value: value,
      })
      const depositReceipt = await depositTransaction.wait()
      setHomeTransferTxHash(depositTransaction.hash)
      const depositEvent = depositReceipt.events!.find((event) => event.event === 'Deposit')
      setDepositNonce(`${depositEvent!.args!.depositNonce.toString()}`)
      setTransactionStatus('In Transit')

      return Promise.resolve()
    } catch (error) {
      console.error(error)
      setTransactionStatus('Transfer Aborted')
      setSelectedToken(tokenAddress)
    }
  }

export default makeDeposit
