import { RouterProvider } from "react-router-dom"
import router from "./router/router"
import AuthProvider from "./context/AuthContext"
import SnackBarProvider from "./context/snackBarContext"
import AlertSnackbar from "./components/SnackBar"
function App() {
  return (
    <>
    <SnackBarProvider>
    <AuthProvider>
    <RouterProvider router={router} />
    <AlertSnackbar />
    </AuthProvider>
    </SnackBarProvider>
    </>
  )
}

export default App
