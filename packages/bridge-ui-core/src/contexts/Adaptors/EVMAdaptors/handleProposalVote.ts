import { Dispatch } from 'react'
import { BigNumber, Event } from 'ethers'
import { Bridge } from '@chainsafe/chainbridge-contracts'
import { BridgeConfig } from '../../../chainbridgeConfig'
import { AddMessageAction, ResetAction, TxIsDone } from '../../../reducers'
import { TransactionStatus } from '../../NetworkManagerContext'

const handleProposalVote = (
  destinationBridge: Bridge,
  homeChainConfig: BridgeConfig,
  depositNonce: string,
  depositVotes: number,
  tokensDispatch: Dispatch<AddMessageAction | ResetAction | TxIsDone>,
  setDepositVotes: (input: number) => void,
  transactionStatus?: TransactionStatus,
) => {
  // @ts-ignore
  destinationBridge.on(
    destinationBridge.filters.ProposalVote(null, null, null, null),
    async (originDomainId: number, depositNonce: BigNumber, status: number, dataHash: string, tx: Event) => {
      const txReceipt = await tx.getTransactionReceipt()
      if (status === 1) {
        setDepositVotes(depositVotes + 1)
      }

      if (transactionStatus === 'Transfer Completed') {
        return tokensDispatch({
          type: 'setTransactionIsDone',
        })
      }

      return tokensDispatch({
        type: 'addMessage',
        payload: {
          address: String(txReceipt.from),
          signed: txReceipt.status === 1 ? 'Confirmed' : 'Rejected',
          order: parseFloat(`1.${txReceipt.transactionIndex}${depositVotes + 1}$`),
          eventType: 'Vote',
        },
      })
    },
  )
}
export default handleProposalVote
