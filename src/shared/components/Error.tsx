import { Box, Button, Paper, Typography } from '@mui/material';
import { TLoginError, TNetworkError } from '../../types/types';


type ErrorType = TLoginError | TNetworkError;
// Type guard to check if the error is a network error
const isNetworkError = (err: ErrorType): err is TNetworkError => {
    return 'error' in err && 'status' in err && !('data' in err);
};
const Error = ({ err }: { err: TLoginError; }) => {
    const reloadPage = () => {
        window.location.reload();
    };
    // Extract the error message and status based on the error type
    const getErrorDetails = (error: ErrorType) => {
        if (isNetworkError(error)) {
            return {
                status: error.status,
                message: 'Server is not responding. Please check your internet connection or wait a moment.'
            };
        } else {
            const data = error?.data as any;
            const detailedMessage = data?.errorSources?.[0]?.message;
            return {
                status: error?.status,
                message: detailedMessage || data?.message || "Unknown error occurred"
            };
        }
    };

    const errorDetails = getErrorDetails(err);

    return (
        <>
            <Box sx={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Paper
                    sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '50%', height: '25%', backgroundColor: 'rgba(232, 88, 129, 0.2)', color: 'rgba(232, 88, 129, 1)', gap: '1rem', p: 2, borderRadius: '8px' }}
                    elevation={24}
                    square={false}
                >
                    <Box component="div">
                        <Typography variant="h3" align='center'>{errorDetails.status} : {errorDetails.message}</Typography>
                    </Box>
                    <Button variant='contained' size="small" onClick={reloadPage}>Try Again</Button>
                </Paper>
            </Box>
        </>
    );
};

export default Error;