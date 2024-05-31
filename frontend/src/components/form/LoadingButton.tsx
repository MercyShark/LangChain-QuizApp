import { Button } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';


function LoadingButton({isLoading, children, ...rest}) {
    return (
        <Button disabled={isLoading} {...rest}>
            {isLoading ? <CircularProgress /> : children}
        </Button>
    )
}

export default LoadingButton;