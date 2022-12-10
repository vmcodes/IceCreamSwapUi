import React, {useEffect} from "react";
import { useNetworkManager, useChainbridge } from "@icecreamswap/bridge-ui-core";
import {
  Button,
  Modal,
  ProgressBar,
  Typography,
} from "@chainsafe/common-components";
import { useStyles } from "./styles";

const NetworkSelectModal = () => {
  const classes = useStyles();
  const { isReady, chains } = useChainbridge();
  const { walletType, setWalletType } = useNetworkManager();
  const subStyle = { fontSize:'10', color: '#fff', fontWeight:300, fontFamily : 'Fira Code',};

  useEffect(() => {
    // skip selection if only evm chains are present
    if(walletType === "select" && chains?.every((item) => item.type === "Ethereum")){
      setWalletType("Ethereum")
    }
  }, [walletType, chains])

  return (
    <Modal
      active={walletType !== "unset" && walletType !== "Ethereum" && !isReady}
      closePosition="right"
      className={classes.root}
      injectedClass={{
        inner: classes.slide,
      }}
    >
      {walletType === "select" && (
        <>

          <Typography variant="h4" component="p" style= {{fontSize  : "1rem"}} >
             Please select a wallet type
          </Typography>
          <section className={classes.buttons}>
            {chains?.every((item) => item.type === "Ethereum") ? (
              <Button className={classes.btn} onClick={() => setWalletType("Ethereum")}>
                Use wallet
              </Button>
            ) : (
              <>
                <Button className={classes.btn} onClick={() => setWalletType("Ethereum")}>
                  Use wallet
                </Button>
                <Button className={classes.btn} onClick={() => setWalletType("Substrate")}>
                  Use Substrate wallet
                </Button>
              </>
            )}
          </section>
        </>
      )}
      {walletType === "Substrate" && (
        <>
          <Typography variant="h2" component="p">
            Connecting to node
          </Typography>
          <ProgressBar size="small" variant="primary" />
        </>
      )}
    </Modal>
  );
};

export default NetworkSelectModal;
