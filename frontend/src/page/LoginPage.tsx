// import * as React from 'react';
import CssBaseline from "@mui/material/CssBaseline";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { login } from "../api/quiz";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { set, useForm } from "react-hook-form";
import { useSnackBar } from "../context/snackBarContext";
import { isStrongPassword } from "../utils/strongPassword";
import { useState } from "react";
import { ConstructionOutlined, Password } from "@mui/icons-material";
import { isEmail } from "validator";
import Alert from "@mui/material/Alert";
import { Stack } from "@mui/material";
import PasswordField from "../components/form/PasswordField";
import LoadingButton from "../components/form/LoadingButton";
function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();
interface FormValues {
  email: string;
  password: string;
}
export default function SignIn() {
  const { user, setUser } = useAuth();
  const [error, setError] = useState<null | {}>(null);
  const { register, handleSubmit, formState ,setValue , setFocus , watch} = useForm<FormValues>();
  const { displaySnackBar } = useSnackBar();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  // console.log("location", location);
  // console.log("from", from);
  // console.log(formState.errors);
  const fakeDelay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const onSubmit = async (data) => {
    const { email, password } = data;
    // await fakeDelay(3000);
    login(email, password)
      .then((response) => {
        setUser(response);
        displaySnackBar("Login Successfull");
        navigate(from, { replace: true });
      })
      .catch((error) => {
        console.log(error);
        displaySnackBar("Invalid Email or Password");
        setError(error);
      });
  };

  console.log(formState.dirtyFields)
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />

        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              autoFocus
              {...register("email", {
                required: "Email is required",
                validate: (value) => isEmail(value) || "Invalid Email",
              })}
              helperText={formState.errors.email?.message}
              error={!!formState.errors.email}
              InputLabelProps={{ shrink: formState.dirtyFields.email  }}
            />

            <PasswordField
              {...register("password", { required: "Password is required" })}
              helperText={formState.errors.password?.message}
              error={!!formState.errors.password}
              InputLabelProps={{ shrink: formState.dirtyFields.password }}

            />
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              isLoading={formState.isSubmitting}
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </LoadingButton>
            <Alert
              variant="standard"
              severity="info"
              sx={{ mb: 1 }}
              action={
                <Button color="inherit" size="small" variant="text" onClick={
                  () => {
                    setValue("email", "prajapatirishabh04@gmail.com",{ shouldDirty : true})                    
                    setValue("password", "test@rishabh1234$$",{ shouldDirty : true})
                  }
                }>
                  Use Value
                </Button>
              }
            >
              <Stack direction="column"></Stack>
              <Box>Demo User</Box>
              <Box>email: test@gmail.com </Box> 
              <Box>password: password</Box>

            </Alert>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link component={NavLink} to={"/signup"} variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
