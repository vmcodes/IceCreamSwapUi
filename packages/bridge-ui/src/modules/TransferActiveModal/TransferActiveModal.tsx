import React from "react";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";

import ErrorIcon from "@mui/icons-material/Error";
import { CustomModal } from "../../components";
import {
  useDestinationBridge,
  useHomeBridge,
  useChainbridge,
  TransactionStatus,
} from "@icecreamswap/bridge-ui-core";

import InitTransferBody from "./InitTransferBody";
import InTransitBody from "./InTransitBody";
import TransferCompleteBody from "./TransferCompleteBody";
import ErrorTransferBody from "./ErrorTransferBody";

import { useStyles } from "./styles";
import { Box, Modal } from "@mui/material";

interface ITransferActiveModalProps {
  open: boolean;
  close: () => void;
}

const style = {
  position: 'absolute' as 'absolute',
  borderRadius : '20px',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
  bgcolor: '#1e1f24',
    color : "#fff",
    boxShadow: 24,
    p: 4,
  };

const getTransactionStateIndicator = (status?: TransactionStatus) => {
  const tranactionStatuses: { [key: string]: string | React.ReactNode } = {
    "Initializing Transfer": "1",
    "Approve 0": "1.1",
    "Approve": "2",
    "Deposit": "3",
    "In Transit": "4",
    "Transfer Completed": "5",
    default: <ErrorIcon />,
  };
  if (!status) return tranactionStatuses["default"];

  return tranactionStatuses[status] || tranactionStatuses["default"];
};

const getTransactionStateProgress = (status?: TransactionStatus) => {
  const tranactionProgress: { [key: string]: number } = {
    "Initializing Transfer": 0,
    "Approve 0": 10,
    "Approve": 20,
    "Deposit": 40,
    "In Transit": 60,
    "Transfer Completed": 100,
    default: 0
  };
  if (!status) return tranactionProgress["default"];

  return tranactionProgress[status] || tranactionProgress["default"];
};

const getTransactionStateHeader = (
  status?: TransactionStatus,
  depositVotes?: number,
  relayerThreshold?: number
) => {
  const tranactionStatuses: { [key: string]: string } = {
    "Initializing Transfer": "Initializing Transfer",
    "Approve 0": "Seting token allowance to 0",
    "Approve": "Setting token allowance",
    "Deposit": "Sending Bridge deposit",
    "In Transit": `In Transit (${
      Number(depositVotes) < (relayerThreshold || 0)
        ? (
              relayerThreshold !== 1?
                `${depositVotes}/${relayerThreshold} signatures needed` 
                : `waiting for relayer`
          )
        : "Executing proposal"
    })`,
    "Transfer Completed": "Transfer Completed",
    default: "Transfer aborted",
  };
  if (!status) return tranactionStatuses["default"];

  return tranactionStatuses[status] || tranactionStatuses["default"];
};

const TransferActiveModal: React.FC<ITransferActiveModalProps> = ({
  open,
  close,
}: ITransferActiveModalProps) => {
  const classes = useStyles();
  const {
    transactionStatus,
    relayerThreshold,
    homeConfig,
    destinationChainConfig,
    depositAmount,
    selectedToken,
    tokens,
  } = useChainbridge();
  const { homeTransferTxHash } = useHomeBridge();
  const { transferTxHash, depositVotes, inTransitMessages } =
    useDestinationBridge();
  const tokenSymbol = selectedToken && tokens[selectedToken]?.symbol;

  const getTransactionStateBody = (status?: TransactionStatus) => {
    const tranactionStatuses: { [key: string]: React.ReactNode } = {
      "Initializing Transfer": <InitTransferBody classes={classes} />,
      "Approve 0": <InitTransferBody classes={classes} />,
      "Approve": <InitTransferBody classes={classes} />,
      "Deposit": <InitTransferBody classes={classes} />,
      "In Transit": (
        <InTransitBody
          classes={classes}
          inTransitMessages={inTransitMessages}
          homeConfig={homeConfig}
          homeTransferTxHash={homeTransferTxHash}
        />
      ),
      "Transfer Completed": (
        <TransferCompleteBody
          classes={classes}
          close={close}
          homeConfig={homeConfig}
          homeTransferTxHash={homeTransferTxHash}
          depositAmount={depositAmount}
          tokenSymbol={tokenSymbol}
          destinationChainConfig={destinationChainConfig}
        />
      ),
      default: (
        <ErrorTransferBody
          classes={classes}
          close={close}
          homeConfig={homeConfig}
          homeTransferTxHash={homeTransferTxHash}
          transferTxHash={transferTxHash}
        />
      ),
    };
    if (!status) return tranactionStatuses["default"];

    return tranactionStatuses[status] || tranactionStatuses["default"];
  };

  return (
    <CustomModal
      active={open}
      closePosition="none"
    >
       <Box sx={style} >

      <section >
        <div className={classes.stepIndicator}>
          {getTransactionStateIndicator(transactionStatus)}
        </div>
      </section>
      <section className={classes.content}>
        <Typography className={classes.heading}
          sx={{fontWeight : 'bold', fontSize : "1.2rem", color : "#f07093"}}
        >
          {getTransactionStateHeader(
            transactionStatus,
            depositVotes,
            relayerThreshold
          )}
          </Typography>
          <LinearProgress
          sx={{
          borderRadius : '15px',
          width: "100%",
          "& > *": {
            borderRadius: "0 !important",
            "&  >  *": {
              borderRadius: "0 !important",
            },
          },
        }}
          variant="determinate"
          value={getTransactionStateProgress(transactionStatus)}
          />

        {getTransactionStateBody(transactionStatus)}
        </section>
        </Box>
    </CustomModal>
  );
};

export default React.memo(TransferActiveModal);
