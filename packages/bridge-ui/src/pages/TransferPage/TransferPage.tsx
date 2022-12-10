import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link } from 'react-router-dom'

import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Button from '@mui/material/Button'
import FeeIcon from '@mui/icons-material/LocalGasStation'
import clsx from 'clsx'
import SwapIcon from '@mui/icons-material/SwapHoriz'
import PoolIcon from '@mui/icons-material/Waves'
import InfoIcon from '@mui/icons-material/GridView'
import BridgeIcon from '@mui/icons-material/AllInclusive'
import LaunchpadIcon from '@mui/icons-material/RocketLaunch'

import { useChainbridge, useHomeBridge, useNetworkManager } from '@icecreamswap/bridge-ui-core'
import { showImageUrl } from '../../utils/Helpers'
import { useStyles } from './styles'

import {
  TransferActiveModal,
  NetworkUnsupportedModal,
  PreflightModalTransfer,
  ChangeNetworkDrawer,
  AboutDrawer,
  NetworkSelectModal,
} from '../../modules'
import { AddressInput, TokenSelectInput, TokenInput, Fees, SelectDestinationNetwork } from '../../components'

import HomeNetworkConnectView from './HomeNetworkConnectView'

import makeValidationSchema from './makeValidationSchema'
import styled from 'styled-components'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Paper from '@mui/material/Paper'
import { createTheme, ThemeProvider } from '@mui/material/styles'

let theme = createTheme({
  palette: {
    primary: {
      main: '#f07093',
    },
  },
})

const BootstrapButton = styled(Button)({
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: 13,
  padding: '6px 12px',
  border: '1px solid',
  backgroundColor: '#1e1f24',
  marginRight: 0,
  lineHeight: 1.5,
  borderColor: '#1e1f24',
  fontFamily: 'Fira Code',
  color: '#7dff6b',
  borderRadius: '10px',
  position: 'absolute',
  right: 0,
  '&:hover': {
    backgroundColor: '#222327',
    boxShadow: 'none',
  },
})

export type PreflightDetails = {
  tokenAmount: number
  token: string
  tokenSymbol: string
  receiver: string
}

const TransferPage = () => {
  const classes = useStyles()
  const { walletType, setWalletType } = useNetworkManager()

  const {
    deposit,
    setDestinationChain,
    transactionStatus,
    resetDeposit,
    bridgeFee,
    bridgeFeeToken,
    tokens,
    isReady,
    homeConfig,
    destinationChainConfig,
    destinationChains,
    address,
    checkSupplies,
  } = useChainbridge()

  const isMobile = window.screen.width < 600

  const { accounts, selectAccount, setSelectedToken, setDepositAmount, depositAmount } = useHomeBridge()
  const [aboutOpen, setAboutOpen] = useState<boolean>(false)
  const [walletConnecting, setWalletConnecting] = useState(false)
  const [changeNetworkOpen, setChangeNetworkOpen] = useState<boolean>(false)
  const [preflightModalOpen, setPreflightModalOpen] = useState<boolean>(false)

  const [preflightDetails, setPreflightDetails] = useState<PreflightDetails>({
    receiver: '',
    token: '',
    tokenAmount: 0,
    tokenSymbol: '',
  })

  useEffect(() => {
    if (walletType !== 'select' && walletConnecting) {
      setWalletConnecting(false)
    } else if (walletType === 'select') {
      setWalletConnecting(true)
    }
  }, [walletType, walletConnecting])

  const transferSchema = makeValidationSchema({
    preflightDetails,
    tokens,
    bridgeFee,
    bridgeFeeToken,
    homeConfig,
    destinationChainConfig,
    checkSupplies,
  })

  const { handleSubmit, control, setValue, watch, formState, getValues } = useForm<PreflightDetails>({
    resolver: yupResolver(transferSchema),
    defaultValues: {
      token: '',
      tokenAmount: 0,
      receiver: `${address}` !== 'undefined' ? `${address}` : '',
    },
  })

  useEffect(() => {
    const newAmount = getValues('tokenAmount')
    if (newAmount !== depositAmount) {
      console.log('setting depositAmount')
      setDepositAmount(getValues('tokenAmount'))
    }
  })

  const watchToken = watch('token', '')
  const watchAmount = watch('tokenAmount', 0)

  const onSubmit: SubmitHandler<PreflightDetails> = (values) => {
    setPreflightDetails({
      ...values,
      tokenSymbol: tokens[values.token].symbol || '',
    })
    setPreflightModalOpen(true)
  }

  const feeTokenSymbol = bridgeFeeToken
    ? bridgeFeeToken == '0x0000000000000000000000000000000000000000'
      ? homeConfig?.nativeTokenSymbol
      : tokens[bridgeFeeToken].symbol
    : ''

  const [value, setValue2] = React.useState(0)

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <section>
          {/*<Typography  style={ {color:'#7dff6b', fontSize : '15px', fontFamily : 'Fira Code', marginBottom : '10px'} }> <FeeIcon sx={{color:'#7dff6b', paddingTop : '7px'}} />Fee: 1%</Typography>*/}

          <BootstrapButton variant="contained" disableRipple>
            <FeeIcon sx={{ marginRight: '3px' }} />
            Fee : 1%
          </BootstrapButton>
        </section>
        <HomeNetworkConnectView
          isReady={isReady}
          accounts={accounts}
          address={address}
          classes={classes}
          walletConnecting={walletConnecting}
          walletType={walletType}
          homeConfig={homeConfig}
          setWalletType={setWalletType}
          setChangeNetworkOpen={setChangeNetworkOpen}
          selectAccount={selectAccount}
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <section>
            <SelectDestinationNetwork
              label="Destination Network"
              disabled={!homeConfig || formState.isSubmitting}
              options={destinationChains.map((dc: any) => ({
                label: dc.name,
                value: dc.domainId,
              }))}
              onChange={(value: number | undefined) => setDestinationChain(value)}
              value={destinationChainConfig?.domainId}
            />
          </section>
          <section className={classes.currencySection}>
            <section>
              <TokenSelectInput
                control={control}
                rules={{ required: true }}
                tokens={tokens}
                name="token"
                disabled={!destinationChainConfig || formState.isSubmitting}
                label={`Balance: `}
                className={classes.generalInput}
                sync={(tokenAddress) => {
                  setPreflightDetails({
                    ...preflightDetails,
                    token: tokenAddress,
                    receiver: '',
                    tokenAmount: 0,
                    tokenSymbol: '',
                  })
                  setSelectedToken(tokenAddress)
                }}
                setValue={setValue}
                options={
                  Object.keys(tokens).map((t) => ({
                    value: t,
                    label: (
                      <div className={classes.tokenItem}>
                        {tokens[t]?.imageUri && <img src={showImageUrl(tokens[t]?.imageUri)} alt={tokens[t]?.symbol} />}
                        <span>{tokens[t]?.symbol || t}</span>
                      </div>
                    ),
                  })) || []
                }
              />
            </section>
            <section>
              <div>
                <TokenInput
                  classNames={{
                    input: clsx(classes.tokenInput, classes.generalInput),
                    button: classes.maxButton,
                  }}
                  tokenSelectorKey={watchToken}
                  tokens={tokens}
                  disabled={
                    !destinationChainConfig ||
                    formState.isSubmitting ||
                    !preflightDetails.token ||
                    preflightDetails.token === ''
                  }
                  name="tokenAmount"
                  label="Amount to send"
                  setValue={setValue}
                  control={control}
                />
              </div>
            </section>
          </section>
          <section>
            <AddressInput
              disabled={false}
              // disabled={!destinationChainConfig || formState.isSubmitting}
              name="receiver"
              label="Destination Address"
              placeholder="Please enter the receiving address"
              senderAddress={`${address}`}
              sendToSameAccountHelper={destinationChainConfig?.type === homeConfig?.type}
              setValue={setValue}
              control={control}
            />
          </section>
          {tokens[preflightDetails.token] && (
            <Fees
              amountFormikName="tokenAmount"
              className={classes.fees}
              fee={bridgeFee}
              feeSymbol={feeTokenSymbol}
              symbol={
                preflightDetails && tokens[preflightDetails.token] ? tokens[preflightDetails.token].symbol : undefined
              }
              amount={watchAmount}
            />
          )}
          <section>
            <Button
              disabled={!destinationChainConfig || formState.isSubmitting}
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                borderRadius: '20px',
                height: '50px',
                fontWeight: 400,
                backgroundColor: '#f07093',
                color: '#fff',
                fontSize: '15px',
                fontFamily: 'Fira Code',
                ':hover': {
                  backgroundColor: '#bd4e6c',
                  opacity: 0.9,
                },
                ':disabled': {
                  backgroundColor: '#3a3c48',
                  color: '#6a7287',
                },
              }}
            >
              TRANSFER
            </Button>
          </section>
          <section>
            <HelpOutlineIcon onClick={() => setAboutOpen(true)} className={classes.faqButton} />
          </section>
        </form>
        <AboutDrawer open={aboutOpen} close={() => setAboutOpen(false)} />
        <ChangeNetworkDrawer open={changeNetworkOpen} close={() => setChangeNetworkOpen(false)} />
        <PreflightModalTransfer
          open={preflightModalOpen}
          close={() => setPreflightModalOpen(false)}
          receiver={preflightDetails?.receiver || ''}
          sender={address || ''}
          start={() => {
            setPreflightModalOpen(false)
            preflightDetails && deposit(preflightDetails.tokenAmount, preflightDetails.receiver, preflightDetails.token)
          }}
          sourceNetwork={homeConfig?.name || ''}
          targetNetwork={destinationChainConfig?.name || ''}
          tokenSymbol={preflightDetails?.tokenSymbol || ''}
          value={preflightDetails?.tokenAmount || 0}
        />
        <TransferActiveModal open={!!transactionStatus} close={resetDeposit} />
        {/* This is here due to requiring router */}
        <NetworkUnsupportedModal />
        <NetworkSelectModal />

        {isMobile && (
          <Paper
            sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#1e1f24', fontSize: '10px' }}
            elevation={3}
          >
            <BottomNavigation
              sx={{
                backgroundColor: '#1e1f24',
                color: 'red',
                '& .MuiBottomNavigationAction-root, .Mui-selected, svg': {
                  color: '#fff',
                  fontFamily: 'Fira Code',
                },
                '& .Mui-selected > svg, & .Mui-selected ': {
                  color: '#f07093',
                  fontFamily: 'Fira Code',
                },
              }}
              showLabels
              value={'Bridge'}
              onChange={(event, newValue) => {
                setValue2(newValue)
              }}
            >
              <BottomNavigationAction href={'//app.icecreamswap.com/#/swap'} label="Swap" icon={<SwapIcon />} />
              <BottomNavigationAction
                label="Pool"
                href={'//app.icecreamswap.com/#/pool'}
                // component={Link}
                // to="/pool"
                icon={<PoolIcon />}
              />

              <BottomNavigationAction label="Info" href={'//info.icecreamswap.com'} icon={<InfoIcon />} />

              {/*<BottomNavigationAction label="Launchpad"*/}
              {/*                        href={"//launchpad.icecreamswap.com"}*/}
              {/*                        icon={<LaunchpadIcon />}/>*/}

              <BottomNavigationAction label="Bridge" value="Bridge" icon={<BridgeIcon />} />
            </BottomNavigation>
          </Paper>
        )}
      </div>
    </ThemeProvider>
  )
}
export default TransferPage
