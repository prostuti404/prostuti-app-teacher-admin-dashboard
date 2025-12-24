import { Snackbar, SnackbarCloseReason } from "@mui/material";

const Alert = ({ openSnackbar, autoHideDuration, handleCloseSnackbar, isSuccess, message, successMessage, errorMessage }: { openSnackbar: boolean; autoHideDuration: number; handleCloseSnackbar: (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => void; isSuccess: boolean; message?: string, successMessage?: string, errorMessage?: string; }) => {
    return (
        <Snackbar
            open={openSnackbar}
            autoHideDuration={autoHideDuration}
            onClose={handleCloseSnackbar}
            message={isSuccess ? (successMessage || 'Operation completed successfully!') : (message || errorMessage || 'There was a problem')}
        />
    );
};

export default Alert;