import { Snackbar, SnackbarContent } from "@mui/material";
import { snankBarContext } from "../context/snackBarContext";
import { useContext } from "react";
export default function AlertSnackbar() {

  const { open, setOpen, message, sx } = useContext(snankBarContext);
  // Return the Snackbar
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={open}
      onClose={() => setOpen(false)}
      autoHideDuration={2000}
    >
      <SnackbarContent message={message} sx={sx}></SnackbarContent>
    </Snackbar>
  );
}
