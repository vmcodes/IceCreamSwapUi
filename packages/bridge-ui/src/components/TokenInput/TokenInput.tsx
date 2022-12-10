import React from "react";
import { useController } from "react-hook-form";
// import { Button, FormikTextInput } from "@chainsafe/common-components";
import { Tokens } from "@chainsafe/web3-context/dist/context/tokensReducer";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import { InputAdornment, Typography } from "@mui/material";

interface ITokenInput {
  disabled?: boolean;
  label: string;
  name: string;
  tokens: Tokens;
  tokenSelectorKey: string;
  classNames?: {
    input?: string;
    button?: string;
  };
  setValue?: any;
  control?: any;
}

const TokenInput: React.FC<ITokenInput> = ({
  classNames,
  disabled,
  label,
  tokens,
  tokenSelectorKey,
  name,
  setValue,
  control,
}: ITokenInput) => {
  const { field, fieldState } = useController({ name, control });
  return (
    <Box sx={{ mt: 2 }}>
           <Typography  sx={{
                   marginTop : '20px',
                  color : "#b9c5cb", fontSize : '12px', marginBottom : '5px', fontFamily : 'Fira Code',
                }}
              variant="body1">Amount to send
              </Typography>
      <TextField
       sx={{ 
        input: { color: '#fff',fontFamily : 'Fira Code', fontWeight : 800},
        label: { color: '#b9c5cb', fontSize: '15px'},
          // width : '450px',
          color : '#fff', 
          border :'1px solid #4c4f5c',
          borderRadius : '10px',
          fontSize : '15px',
          padding : '5px',
           fontFamily : 'Fira Code',
      }} 
         variant="standard"
        disabled={disabled}
        error={!!fieldState.error}
        fullWidth
        helperText={fieldState.error ? fieldState.error.message : undefined}
        className={classNames?.input}
        // label={label}
        {...field}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{color: '#4c4f5c'}}>
              <PriceChangeIcon  />
            </InputAdornment>
          ),
          endAdornment: (
            <Button sx={{
                fontFamily : 'Fira Code',
              backgroundColor : '#3a3d47',
              color : '#fff',
              ":hover": {
                backgroundColor: "#4c4f5c",
                opacity: 0.9,
              },
              ":disabled": {
                backgroundColor : '#3a3c48',
                color : '#6a7287'
              },
            }}
              disabled={disabled || !tokens[tokenSelectorKey]}
              className={classNames?.button}
              onClick={() => {
                setValue(name, tokens[tokenSelectorKey].balance);
              }}
              variant="contained"
              type="button"
            >
              MAX
            </Button>
          ),
        }}
      />
    </Box>
  );
};

export default TokenInput;
