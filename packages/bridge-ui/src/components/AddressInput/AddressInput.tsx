import React, { useCallback, useState } from "react";
import { useController } from "react-hook-form";
import FormControl from "@mui/material/FormControl";

import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { InputAdornment, Typography } from "@mui/material";
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

interface IAddressInput {
  senderAddress: string;
  className?: any;
  placeholder: string;
  name: string;
  label: string;
  disabled: boolean;
  sendToSameAccountHelper?: boolean;
  control?: any;
  classNames?: any;
  setValue?: any;
}

const AddressInput: React.FC<IAddressInput> = ({
  senderAddress,
  placeholder,
  name,
  label,
  sendToSameAccountHelper = false,
  control,
  setValue,
  disabled,
  ...rest
}: IAddressInput) => {
  const { field, fieldState } = useController({ name, control });

  const [stored, setStored] = useState<string | undefined>("");

  const toggleReceiver = useCallback(() => {
    if (senderAddress == "undefined") {
        return
    }
    if (stored === undefined) {
      setStored(field.value);
      setValue(name, senderAddress);
    } else {
      setValue(name, "");
      setStored(undefined);
    }
  }, [name, senderAddress, field, setStored, setValue]);

  return (
    <FormControl sx={{ color: '#fff' }} disabled={disabled} fullWidth>
      {sendToSameAccountHelper && (
        <>
        {stored !== undefined?
          <></>
          :
            <>
              <Typography sx={{
                          color : "#b9c5cb", fontSize : '12px', marginBottom : '5px',
                        }}
                      variant="body1">Destination address
                      </Typography>
                <TextField sx={{
                    input: { color: '#fff', },
                    label: { color: '#b9c5cb', fontSize: '15px'},
                    // width : '450px',
                    color : '#fff',
                    border :'1px solid #4c4f5c',
                    borderRadius : '10px',
                    fontSize : '15px',
                    padding : '5px',
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{color: '#4c4f5c'}}>
                      <AssignmentIndIcon  />
                    </InputAdornment>
                  ),
                }}
                  variant = "standard"
                  error={!!fieldState.error}
                  helperText={fieldState.error ? fieldState.error.message : undefined}
                  fullWidth
                  {...field}
                  // label={label}
                  placeholder={placeholder}
                  disabled={Boolean(disabled || stored !== undefined)}
                />
              </>
            }
          </>
        )}
      {sendToSameAccountHelper && (
        <FormGroup sx={{ my: 1 }}>
          <FormControlLabel sx={{ fontSize: '10px', color : '#babcc0', fontFamily : "sans-serif"}}
            control={
              <Checkbox sx={{color : "#bd4e6c", fontFamily : 'Fira Code', '&.Mui-checked': {
                  color: "#bd4e6c",
                }, }}
                size="small"
                disabled={disabled || senderAddress == "undefined"}
                checked={stored !== undefined}
                onChange={() => toggleReceiver()}
              />
            }
             label={<Typography sx={{ fontWeight : '400', fontFamily : 'Fira Code', fontSize : "13px"}}>I want to send funds to my address</Typography>}
          />
        </FormGroup>
      )}
    </FormControl>
  );
};

export default AddressInput;
