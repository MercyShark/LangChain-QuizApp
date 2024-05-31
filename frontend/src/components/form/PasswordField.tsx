import React, { forwardRef } from 'react'
import { TextField } from '@mui/material'
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";

// const PasswordField = forwardRef((props, ref) => {
    // const [showPassword, setShowPassword] = React.useState(false);
//     const { ...rest} = props
//   return (
//     <TextField
//               margin="normal"
//               required
//               fullWidth
//               label="Password"
//               type= {showPassword ? "text" : "password"}
//               id="password"
//               autoComplete="current-password"
//                 InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton onClick={() => setShowPassword((value) => !value)}>
//                       {showPassword ? <Visibility /> : <VisibilityOff />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />
//     )
    
// }


const PasswordField = forwardRef(({ ...rest }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    return (
        <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Password"
                  type= {showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  {...rest}
                  ref={ref}
                    InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((value) => !value)}>
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
        )
  });

export default PasswordField