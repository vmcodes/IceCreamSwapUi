import React from "react";
import { SelectInput } from "@chainsafe/common-components";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { WalletType } from "@icecreamswap/bridge-ui-core";
import { BridgeConfig } from "../../chainbridgeConfig"
import PowerIcon from '@mui/icons-material/Power';


type HomeNetworkConnectViewProps = {
  isReady: boolean | undefined;
  classes: any;
  setWalletType: (walletType: WalletType) => void;
  walletType: string;
  walletConnecting: boolean;
  setChangeNetworkOpen: React.Dispatch<React.SetStateAction<boolean>>;
  homeConfig: BridgeConfig | undefined;
  accounts: Array<any> | undefined;
  selectAccount: any;
  address: string | undefined;
};

export default function HomeNetworkConnectView({
  isReady,
  accounts,
  address,

  classes,
  walletConnecting,
  walletType,

  homeConfig,

  setWalletType,
  setChangeNetworkOpen,
  selectAccount,
}: HomeNetworkConnectViewProps) {
  return (
    <>
      <div className={classes.walletArea}>
        {!isReady && (
          <Button
            fullWidth
            variant="contained"
            sx={{
              borderRadius : '10px',
              height : '50px',
              fontWeight : '400',
              backgroundColor : '#f07093',
              color : '#fff',
              fontSize : '15px',
              fontFamily : 'Fira Code',
              ":hover": {
                backgroundColor : '#bd4e6c',
                }
            }}
            onClick={() => {
              setWalletType("select");
            }}
          >
            <PowerIcon sx={{marginRight:'0px'}} />Connect Wallet
          </Button>
        )}
        {isReady &&
          (walletConnecting ? (
            <section className={classes.connecting}>
              <Typography component="p" variant="h5">
                This app requires access to your wallet, <br />
                please login and authorize access to continue.
              </Typography>
            </section>
          ) : (
            <section className={classes.connected}>
              <div>
                <Typography sx={{
                  fontFamily : 'Fira Code',
                   marginTop : '20px',
                  color : "#b9c5cb", fontSize : '12px', 
                }}
                 variant="body1">Home network</Typography>
                {/* <Typography
                  className={classes.changeButton}
                  variant="body1"
                  onClick={() => setChangeNetworkOpen(true)}
                >
                  Change
                </Typography> */}
              </div>
              <Typography sx={{
                border :'1px solid #4c4f5c',
                borderRadius : '10px',
                  fontSize : '15px',
                  marginTop : '10px',
                  fontFamily : 'Fira Code',
                }}
                component="h5"
                variant="h5"
                className={classes.networkName}
              >
                {homeConfig?.name}
              </Typography>
            </section>
          ))}
      </div>
      {isReady &&
        walletType === "Substrate" &&
        accounts &&
        accounts.length > 0 && (
          <div>
            <section className={classes.accountSelector}>
              <SelectInput
                label="Select account"
                className={classes.generalInput}
                options={accounts.map((acc, i) => ({
                  label: acc.address,
                  value: i,
                }))}
                onChange={(value) => selectAccount && selectAccount(value)}
                value={accounts.findIndex((v) => v.address === address)}
                placeholder="Select an account"
              />
            </section>
          </div>
        )}
    </>
  );
}
