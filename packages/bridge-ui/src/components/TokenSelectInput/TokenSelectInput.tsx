import React, { useEffect, useState } from "react";
import { useController } from "react-hook-form";
import Box from "@mui/material/Box";
import Select2 from 'react-select';
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";

import { Tokens } from "@chainsafe/web3-context/dist/context/tokensReducer";
import { alpha, Menu, MenuProps, Typography } from "@mui/material";
import styled from "styled-components";
import Paper from "@mui/material/Paper";

interface ITokenSelectInput {
  className: any;
  label: any;
  name: any;
  tokens: Tokens;
  rules?: any;
  disabled: any;
  options: any;
  placeholder?: any;
  sync?: (value: string) => void;
  setValue?: any;
  control?: any;
}



const TokenSelectInput: React.FC<ITokenSelectInput> = (
  props: ITokenSelectInput
) => {
  const {
    className,
    label,
    name,
    tokens,
    sync,
    control,
    rules,
    disabled,
    options,
    setValue,
  } = props;
  const { field, fieldState } = useController({ name, control, rules });

  const labelParsed =
    field && tokens[field.value] ? " " : "Please select token";
  const balance = tokens[field.value]
    ? `${tokens[field.value]?.balance} ${tokens[field.value]?.symbol}`
    : " ";


  const [synced, setSynced] = useState();


  useEffect(() => {
    if (sync && field.value !== synced) {
      setSynced(field.value);
      if (field.value !== "") {
        sync(field.value);
      }
    }
    // eslint-disable-next-line
  }, [field]);

  useEffect(() => {
    // If there is only one token, auto select
    if (Object.keys(tokens).length === 1 && field.value === "") {
      setValue("token", Object.keys(tokens)[0]);
    }
  }, [tokens, setValue, field.value]);



  // @ts-ignore
  // @ts-ignore
  return (

    <Box sx={{ marginBottom: '10px' }}
    >
      <FormControl hiddenLabel fullWidth  disabled={disabled}>
        <Typography  sx={{
          color : "#b9c5cb", fontSize : '12px', marginBottom : '5px', fontFamily : 'Fira Code',
        }} variant="body1">
          {balance !== " "? "Token balance : " + balance.slice(0,7): "Token"}
        </Typography>

        <Select fullWidth
                MenuProps={{
                  PaperProps:{
                    sx:{
                      backgroundColor :'#1D1F24',
                      border :'2px solid #4c4f5c',
                      borderRadius : "10px"
                      }
                  }
                }
                }
        sx={{
          'img' : { borderRadius :'50%'},
          color : '#fff',
          height : '45px',
          border :'1px solid #4c4f5c',
          borderRadius : '10px',
          fontSize : '15px',
          '.MuiSvgIcon-root ': {
            fill: "#e27f93 !important",
          },
          list:{
            padding:'0'
          },
          backgroundColor : '#1D1F24',

           //
         }}


         {...field}
        //  label="token"

         >
          {options.map((option: any) => (
            <MenuItem
                sx={{
                  // border :'1px solid #4c4f5c',
                  color : '#fff',
                  backgroundColor : '#1D1F24',
                  "&:hover": {
                    backgroundColor: "#2a2934"
                  },
                  fontFamily : 'Fira Code',
                'img' : { borderRadius :'50%', },
                  '&:focus': {
                    backgroundColor: '#2a2934',
                    "&:hover": {
                      backgroundColor: "#2a2934"
                    },
                  },
                }}
                dense={true}
                key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}

        </Select>
      </FormControl>
    </Box>
  );
};

export default TokenSelectInput;
