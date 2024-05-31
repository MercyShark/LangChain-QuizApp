import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import { Redirect  } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
function ProtectedRoute({children}) {
    const {user,isLoading} = useAuth();
    const  location = useLocation();
    const navigate = useNavigate();
    console.log("helllow")
    console.log(location)
    if(isLoading){
       return (<Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>)
    }
    if(!user){
        return <Navigate to="/login" replace={true} />
    }
    return children;
}

export default ProtectedRoute