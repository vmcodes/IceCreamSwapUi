import React from "react";

import Typography from "@mui/material/Typography";
import ExIcon from '@mui/icons-material/ReportGmailerrorred';

export default function InitTransferBody({ classes }: { classes: any }) {
  return (
    <div className={classes.initCopy}>
      {/*<Typography sx={{ fontFamily: "Fira Code",
        fontWeight: "bold",
      }}>
        Deposit pending...</Typography>*/}
      <Typography className={classes.weighted}>
        <ExIcon style={{ paddingTop : '10px'}}/> This should only take a few minutes.
          {/*<br />
        <ExIcon style={{ paddingTop : '10px'}}/> Please do not refresh or leave the page.*/}
      </Typography>
    </div>
  );
}
