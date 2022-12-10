import React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
// import { useFormikContext } from "formik";

interface IFeesFormikWrapped {
  className?: string;
  symbol?: string;
  fee?: number;
  feeSymbol?: string;
  amountFormikName: string;
  amount?: number;
}

const FeesFormikWrapped: React.FC<IFeesFormikWrapped> = ({
  className,
  symbol,
  fee,
  feeSymbol,
  amountFormikName,
  amount,
}: IFeesFormikWrapped) => {
  // const { values } = useFormikContext();

  return (
      <Box
          sx={{
            paddingLeft : '20px',
            paddingRight : '20px',
            marginBottom : '20px',
            borderStyle: 'dashed',
            borderRadius: '20px',
            borderWidth: 1,
            borderColor: '#f07093',}
          }
      >
    <Box sx={{ my: 2,   ".text-p" : {
      fontFamily : "Fira Code",
      fontWeight :'400',
      fontSize : '14px',
      color : '#babcc0'
    },
    ".text-p2" : {
      fontFamily : "Fira Code",
      fontWeight :'bold',
      fontSize : '15px',
      color : '#fff'
    } }}
    >

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        {fee !== undefined && feeSymbol !== undefined && (
          <>
            <Typography className="text-p" component="p">Bridge Fee</Typography>
            <Typography className="text-p2" component="p">
              {fee} {feeSymbol}
            </Typography>
          </>
        )}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        {symbol !== undefined && (
          <>
            <Typography className="text-p" component="p">Transfer Amount:</Typography>
            <Typography className="text-p2" component="p">
              {Number(amount) /*?.toFixed(3)*/} {symbol}
            </Typography>
          </>
        )}
      </Box>
    </Box>
      </Box>
  );
};

export default FeesFormikWrapped;
