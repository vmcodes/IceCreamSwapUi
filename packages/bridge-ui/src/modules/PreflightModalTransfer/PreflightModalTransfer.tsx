import React from "react";
import { Button, Typography } from "@chainsafe/common-components";
import { shortenAddress } from "../../utils/Helpers";
import { useStyles } from "./styles";
import { Box,  Dialog,  Grid } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';

interface IPreflightModalTransferProps {
  open: boolean;
  close: () => void;
  sender: string;
  receiver: string;
  value: number;
  tokenSymbol: string;
  sourceNetwork: string;
  targetNetwork: string;
  start: () => void;
}

const PreflightModalTransfer: React.FC<IPreflightModalTransferProps> = ({
  open,
  close,
  receiver,
  sender,
  sourceNetwork,
  targetNetwork,
  tokenSymbol,
  value,
  start,
}: IPreflightModalTransferProps) => {
  const classes = useStyles();

  return (
    <Dialog
      PaperProps={{
        style: {
            borderRadius: '15px',
            backgroundColor: '#00000000',
        },
      }}
      className={classes.root}
      open={open}
    > <Box
        sx={{
          width: '100%',
          px: "10%",
          pt: "40px",
          pb: "10px",
          backgroundColor: "#1d1f24",
          color : "#fff"
        }}>
        <Button style={{
          position : "absolute",
          float: 'right',
          top : 5,
          right : 0,
          backgroundColor: "#1d1f24",
          border: "none",
        }} onClick={close}><CancelIcon /></Button>
        <Typography style={{
          fontWeight: 'bold',
          fontSize: "1.2rem",
          color: "#f07093",
        }}>
        Pre-flight check
      </Typography>
      {/*
      <Typography className={classes.subtitle} variant="h5" component="p">
        Please be advised of the risks using this and most other bridges:
      </Typography>
      <ul>
        <li>
          <Typography className={classes.list_agg} variant="body2">
            You will not be able to cancel the transaction once you submit it.
          </Typography>
        </li>
        <li>
          <Typography className={classes.list_agg} variant="body2">
            Funds cannot be returned if they are sent to the wrong address.
          </Typography>
        </li>
        </ul>
        <hr />
        <Typography className={classes.agreement} variant="body2" component="p">
          I agree and want to send{":"}
          </Typography>
        */}
        <Grid container spacing={1} columns={12} width={"300px"}>
        <Grid item xs={3}>
          <Typography>amount<br/></Typography>
          <Typography>sender<br/></Typography>
          <Typography>recipient<br/></Typography>
          <Typography>from<br/></Typography>
          <Typography>to<br/></Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography>: <strong> {value} {tokenSymbol}</strong><br/></Typography>
          <Typography>: <strong>{shortenAddress(sender)}</strong> <br/></Typography>
          <Typography>: <strong>{shortenAddress(receiver)}</strong><br/></Typography>
          <Typography>: <strong>{sourceNetwork}</strong> <br/></Typography>
          <Typography>: <strong>{targetNetwork}</strong><br/></Typography>
        </Grid>
      </Grid>
      <br/>
      <Button onClick={start} className={classes.startButton} fullsize>
        Start Transfer
      </Button>

      </Box>

    </Dialog>
  );
};

export default PreflightModalTransfer;
