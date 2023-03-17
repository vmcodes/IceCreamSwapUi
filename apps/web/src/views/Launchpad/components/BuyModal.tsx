import { Flex, Modal, useModalContext, Text, Button, Heading, Spinner, Input } from '@pancakeswap/uikit'
import { formatAmount } from '../../Bridge/formatter'
import { useCallback, useState } from 'react'
import { FormValues } from '../create-schema'
import styled from 'styled-components'
import { useAddUserToken } from 'state/user/hooks'
import { useToken } from 'hooks/Tokens'
import useUserAddedTokens from 'state/user/hooks/useUserAddedTokens'
import { useAccount, useBalance } from 'wagmi'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { BigNumber, utils } from 'ethers'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { CampaignData, useCampaign, useCampaignFactory } from '../hooks'
import { useActiveChain } from 'hooks/useActiveChain'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useNativeBalances } from 'state/wallet/hooks'
import { CurrencyAmount } from '@pancakeswap/sdk'

interface DepositModalProps {
  campaign: CampaignData
}

const Logo = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
`

const Subtitle = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSubtle};
`

type Steps = 'preview' | 'transfer' | 'completed'

const BuyModal: React.FC<DepositModalProps> = (props) => {
  const { campaign } = props
  const [step, setStep] = useState<Steps>('preview')
  const { onDismiss } = useModalContext()
  const { chainId } = useActiveChainId()
  const token = useToken(campaign?.tokenAddress)
  const { address, status } = useAccount()
  const campaignInstance = useCampaign(campaign?.address)
  const chain = useActiveChain()
  const nativeCurrency = useNativeCurrency()
  const balances = useNativeBalances([address])
  const balance = (balances ?? {})[address]

  const [amount, setAmount] = useState('')

  const amountBigint =
    amount &&
    Number(amount) &&
    CurrencyAmount.fromRawAmount(balance?.currency, utils.parseUnits(amount, token?.decimals || 18) as any)

  const handleDeposit = async () => {
    // const initialSupply = utils.parseUnits(String(formValues?.initialSupply || '0'), 18)
    // const maxSupply = utils.parseUnits(String(formValues?.maxSupply || '0'), 18)
    const tx = await campaignInstance?.buyTokens({
      value: utils.parseEther(amount),
    })
    setStep('transfer')
    await tx?.wait()
    setStep('completed')
  }

  const handleDismiss = () => {
    onDismiss()
  }

  const preview = (
    <>
      <Flex flexDirection="column">
        <Text>How much do you want to buy</Text>
        <CurrencyInputPanel
          label="Amount"
          value={amount.toString()}
          showMaxButton
          showQuickInputButton
          disableCurrencySelect
          onUserInput={(value) => {
            setAmount(value)
          }}
          onPercentInput={(percent) => {
            setAmount((+balance?.toExact() * 0.01 * percent).toString())
          }}
          onMax={() => {
            setAmount(balance?.toExact() || '0')
          }}
          currency={nativeCurrency}
          id="bridge-currency-input"
          hideManage
          showCommonBases={false}
          showNative={false}
        />
      </Flex>
      <Flex flexDirection="column">
        <Text>You will recieve</Text>
        <Text>{formatAmount(amountBigint ? amountBigint.multiply(500).toFixed(3) : '0')} TICE</Text>
      </Flex>

      {amountBigint && Number(amountBigint.multiply(500).toFixed(3)) > 50 && (
        <Text style={{ color: 'var(--colors-failure)' }}>You can&apos;t buy more than 50 TICE per account!</Text>
      )}
      {status === 'connected' ? (
        <Button
          style={{ flexGrow: 1 }}
          onClick={handleDeposit}
          disabled={(amountBigint && Number(amountBigint.multiply(500).toFixed(3)) > 50) || !amountBigint}
        >
          Confirm
        </Button>
      ) : (
        <ConnectWalletButton />
      )}
    </>
  )

  const transferCompleted = (
    <>
      <Text>Thanks for you investment</Text>
      <Button onClick={handleDismiss} variant="secondary">
        Close
      </Button>
    </>
  )

  const waitingForTransfer = (
    <>
      <Flex justifyContent="center">
        <Spinner />
      </Flex>
      <Text>Processing Transaction</Text>
    </>
  )

  const steps = {
    preview,
    transfer: waitingForTransfer,
    completed: transferCompleted,
  }

  return (
    <Modal title="Buy Token" onDismiss={handleDismiss} minWidth="min(100vw, 426px)">
      <Flex flexDirection="column" alignItems="stretch" style={{ gap: '1em' }}>
        {steps[step]}
      </Flex>
    </Modal>
  )
}

export default BuyModal
