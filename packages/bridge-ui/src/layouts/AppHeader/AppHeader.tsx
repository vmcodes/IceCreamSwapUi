import React from 'react'
import clsx from 'clsx'
// import { Typography } from "@chainsafe/common-components";
import Typography from '@mui/material/Typography'
import { Switch, NavLink, Link, useRouteMatch } from 'react-router-dom'

import { shortenAddress } from '../../utils/Helpers'
import { useChainbridge } from '@icecreamswap/bridge-ui-core'
import { useStyles } from './styles'
import { Box } from '@mui/material'
import { buttonUnstyledClasses, TabsListUnstyled, TabsUnstyled, TabUnstyled, tabUnstyledClasses } from '@mui/base'
import styled from 'styled-components'
import logo from '../../media/Icons/logo_ice_sm.png'
import ConnectIcon from '@mui/icons-material/ElectricalServices'
import PowerOffIcon from '@mui/icons-material/PowerOff'
import PowerIcon from '@mui/icons-material/Power'
import FeeIcon from '@mui/icons-material/LocalGasStation'
import Button from '@mui/material/Button'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'

const ROUTE_LINKS_HEADERS = [
  { route: '/transfer', label: 'Transfer' },
  { route: '/explorer/transaction/list', label: 'Explorer' },
]

const subStyle = { fontSize: '15px', color: '#fff', fontWeight: 300, fontFamily: 'Fira Code' }

interface IAppHeader {}

const black = {
  0: '#ffffff',
  25: '##c1c5cd',
  50: '#babcc2',
  100: '#3a3c48',
  200: '#1d1f24',
}
const Tab = styled((props) => <TabUnstyled {...props} />)`
  font-family: Inter, sans-serif;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  fontsize: '16px';
  background-color: transparent;
  width: 65px;
  padding-top: 0px;
  margin: 6px 0px;
  border: none;
  border-radius: 12px;
  textdecoration: 'none';
  display: flex;
  justify-content: center;
  height: 18px;
  color: ${black[50]};
  &:hover {
    color: ${black[0]};
  }

  &.${tabUnstyledClasses.selected} {
    background-color: ${black[100]};
    color: #fff;
    height: 30px;
    padding-top: 5px;
  }

  &.${buttonUnstyledClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const TabsList = styled((props) => <TabsListUnstyled {...props} />)`
  a {
    text-decoration: none;
    color: ${black[50]};
    &:hover {
      color: ${black[0]};
    }
  }
  min-width: 100px;
  height: 38px;
  background-color: ${black[200]};
  border-radius: 13px;
  margin-bottom: 16px;
  padding-left: 5px;
  padding-right: 5px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
`

const WalletButton = styled(Button)({
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
  // color : '#f07093',
  borderRadius: '10px',
  position: 'relative',
  '&:hover': {
    backgroundColor: '#222327',
    boxShadow: 'none',
  },
})

const isMobile = window.screen.width < 600
const AppHeader: React.FC<IAppHeader> = () => {
  const classes = useStyles()
  const { homeConfig, isReady, address } = useChainbridge()

  const { __RUNTIME_CONFIG__ } = window

  const indexerEnabled = 'INDEXER_URL' in __RUNTIME_CONFIG__
  const hStyle = { fontSize: '15px', color: '#fff', fontWeight: 300, fontFamily: 'Fira Code' }

  return (
    <header className={clsx(classes.root)}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <div className={classes.left}>
          {<img style={{ width: '23px' }} src={logo} alt="Logo" />}
          {/* <div className={classes.logo}>
        </div> */}
          {/*<div className={classes.mainTitle}>*/}
          {/*  <Typography  style={ hStyle } >ICECREAMSWAP</Typography>*/}
          {/*</div>*/}
          <div className={classes.headerLinks}>
            {/* {indexerEnabled ? (
            ROUTE_LINKS_HEADERS.map(({ route, label }) => (
              <NavLink to={route} className={classes.link} key={route}>
                <Typography variant="h5" className={classes.linkTitle}>
                  {label}
                </Typography>
              </NavLink>
            ))
          ) : (
            <NavLink
              to={ROUTE_LINKS_HEADERS[0].route}
              className={classes.link}
              key={ROUTE_LINKS_HEADERS[0].route}
            >
              <Typography className={classes.linkTitle}>
                {ROUTE_LINKS_HEADERS[0].label}
              </Typography>
            </NavLink>
          )} */}
          </div>
        </div>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <section className={classes.state}>
          {!isReady ? (
            <WalletButton variant="contained" disableRipple>
              <PowerOffIcon sx={{ marginRight: '3px', color: '#f07093' }} />
              No wallet connected
            </WalletButton>
          ) : (
            <>
              <div className={classes.mainInfo}>
                <div className={classes.accountInfo}>
                  {/*<span className={classes.indicator} />*/}
                  <WalletButton variant="contained" disableRipple>
                    <ConnectIcon sx={{ marginRight: '3px', color: '#7dff6b' }} />
                    <Typography style={subStyle} className={classes.address}>
                      <span></span>
                      <span>
                        <strong>{homeConfig?.name} </strong>
                      </span>
                    </Typography>
                    <Typography style={subStyle} className={classes.address}>
                      |{address && shortenAddress(address)}
                    </Typography>
                  </WalletButton>
                </div>
              </div>
            </>
          )}
        </section>
      </Box>
    </header>
  )
}

export default AppHeader
