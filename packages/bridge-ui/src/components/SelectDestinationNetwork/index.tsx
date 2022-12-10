import React, { useEffect, useState } from "react";

import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Typography} from "@mui/material";
import styled from "styled-components";
import { createTheme, ThemeProvider } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    primary: {
      main: '#f07093',
    },
  },
});

interface ISelectDestinationNetwork {
  disabled?: boolean;
  label?: string;
  options?: any;
  onChange?: any;
  value?: number;
}

const SelectDestinationNetwork: React.FC<ISelectDestinationNetwork> = ({
  disabled,
  label,
  options,
  onChange,
  value,
}: ISelectDestinationNetwork) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
    <FormControl  hiddenLabel sx={{ borderColor :"#fff" }} fullWidth disabled={disabled}  >
    <Typography
      sx={{
        fontFamily : 'Fira Code',
      marginTop : '20px',
      color : "#b9c5cb", fontSize : '12px', marginBottom : '5px',
      }}
      variant="body1">Destination network
    </Typography>
    {/* <InputLabel  sx={{  color : '#b9c5cb', }} id="select-destination-network-label">{label}</InputLabel> */}
    <Select
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
      color : '#fff',
      height : '45px',
      border :'1px solid #4c4f5c',
      borderRadius : '10px',
      fontFamily : 'Fira Code',
      "&& .MuiMenuItem": { border :'1px solid #fff',},
      '.MuiSvgIcon-root ': {
        fill: "#e27f93 !important",
      },
      backgroundColor : '#1D1F24',

      fontSize : '15px', }}
      // MenuProps={{
      //   sx: {
      //     "&& .MuiMenuItem-root":{
      //       backgroundColor: "#1D1F24",
      //       },
      //
      //     },
      //   }


      color={"primary"}
      labelId="select-destination-network-label"
      id="select-destination-network"
      onChange={handleChange}
      // label={label}
      value={value ? value.toString() : ""}
    >
      {options.map((option: { label: any; value: any }) => (
        <MenuItem

            sx={{
              color : '#fff',
              backgroundColor : '#1D1F24',
              "&:hover": {
                backgroundColor: "#2a2934"
              },
              '&:focus': {
                backgroundColor: '#2a2934',
                "&:hover": {
                  backgroundColor: "#2a2934"
                },
              },
              fontFamily : 'Fira Code',
              }}
            dense={true}
          key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
      </ThemeProvider>
  );
};

export default SelectDestinationNetwork;
