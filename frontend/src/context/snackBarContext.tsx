import { createContext , useContext } from "react";
import { useState } from "react";

const snankBarContext = createContext(null);
// Context to display the snackbar
const SnackBarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sx, setSx] = useState(null);
  //  Function to display the snackbar
  const displaySnackBar = (message, sx = {}) => {
    setOpen(true);
    setMessage(message);
    setSx(sx);
  };
  // Context value
  const contextValue = {
    open,
    setOpen,
    message,
    sx,
    displaySnackBar,
  };
  // Return the provider
  return (
    <snankBarContext.Provider value={contextValue}>
      {children}
    </snankBarContext.Provider>
  );
};

const useSnackBar = () => {
  return useContext(snankBarContext);
}
export default SnackBarProvider;
export { snankBarContext , useSnackBar };
