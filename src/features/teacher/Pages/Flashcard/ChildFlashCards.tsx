import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, IconButton, Box, Button, Typography, SnackbarCloseReason, Card } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApproveFlashCardMutation, useDeleteChildFlashcardsMutation, useGetChildFlashcardsQuery, useUpdateChildFlashCardMutation } from "../../../../redux/features/flashcard/flashcardApi";
import Loader from "../../../../shared/components/Loader";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteConfirmation from "../../../../shared/components/DeleteConfirmation";
import Alert from "../../../../shared/components/Alert";
import { hasDataProperty } from "../../../../utils/TypeGuardForErrorMessage";
import EditFlashcardModal from "./EditFlashCardModal";
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import Grid from '@mui/material/Grid2';
import { CustomLabel, useAppSelector } from "../Materials/Create Test";
import { TUser } from "../../../../types/types";
import EditRequestButton from "../../../../shared/components/EditRequestButton";

interface Column {
    id: 'sl' | 'question' | 'answer' | 'action';
    label: string;
    minWidth?: number;
    align?: 'right';
}

interface FlashcardItem {
    _id: string;
    term: string;
    answer: string;
}

const columns: readonly Column[] = [
    { id: 'sl', label: 'Sl', minWidth: 50 },
    { id: 'question', label: 'Question', minWidth: 170, },
    { id: 'answer', label: 'Answer', minWidth: 170, align: 'right' },
    { id: 'action', label: 'Action', minWidth: 100, align: 'right' },
];

const ChildFlashCards = () => {
    const user = useAppSelector((state) => state.auth.user as TUser);
    const isAdmin = user?.role === 'admin' ? true : false;
    const { flashcardId } = useParams();
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [childFlashcardId, setChildFlashcardId] = useState<string>('');
    const [open, setOpen] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    // snackbar message
    const [message, setMessage] = useState("");
    const [isSuccessAlert, setIsSuccessAlert] = useState(true);
    // Separate state for update and delete error messages
    const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
    const [updateErrorMessage, setUpdateErrorMessage] = useState("");

    // Edit modal state
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedFlashcard, setSelectedFlashcard] = useState<FlashcardItem | null>(null);

    const [approveFlashCard, { isLoading: approvalLoader, error: approvalError, isSuccess: approvalSuccess }] = useApproveFlashCardMutation();
    // fetching child flashcards
    const { data, isLoading } = useGetChildFlashcardsQuery({ flashcardId });
    // flashcard update call
    const [updateChildFlashCard, { isLoading: updateLoading, isSuccess: updateSuccess, error: updateError }] = useUpdateChildFlashCardMutation();
    // delete child flashcard function from redux
    const [deleteChildFlashcards, { isLoading: flashcardDeleteLoading, isSuccess: deleteSuccess, error: deleteError }] = useDeleteChildFlashcardsMutation();
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Effect to handle success messages
    useEffect(() => {
        if (deleteSuccess) {
            setMessage("Flashcard deleted successfully");
            setIsSuccessAlert(true);
            setOpenSnackbar(true);
        }
        if (updateSuccess) {
            setMessage("Flashcard updated successfully");
            setIsSuccessAlert(true);
            setOpenSnackbar(true);
        }
        if (approvalSuccess) {
            setMessage("Flashcard approved successfully");
            setIsSuccessAlert(true);
            setOpenSnackbar(true);
        }
    }, [deleteSuccess, updateSuccess, approvalSuccess]);

    // Effect to handle error messages
    useEffect(() => {
        if (deleteError && hasDataProperty(deleteError)) {
            setDeleteErrorMessage(deleteError.data.message);
            setIsSuccessAlert(false);
            setOpenSnackbar(true);
        } else {
            setDeleteErrorMessage("");
        }
    }, [deleteError]);

    useEffect(() => {
        if (updateError && hasDataProperty(updateError)) {
            setUpdateErrorMessage(updateError.data.message);
            setIsSuccessAlert(false);
            setOpenSnackbar(true);
        } else {
            setUpdateErrorMessage("");
        }
    }, [updateError]);

    // approval error handling
    useEffect(() => {
        if (approvalError && hasDataProperty(approvalError)) {
            setUpdateErrorMessage(approvalError.data.message);
            setIsSuccessAlert(false);
            setOpenSnackbar(true);
        } else {
            setUpdateErrorMessage("");
        }
    }, [approvalError]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    // table pages function
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    if (isLoading || approvalLoader) {
        return <Loader />;
    }

    console.log('child cards:', data?.data);

    const rows = data?.data.items || [];
    const approved = data?.data.isApproved;
    const totalRows = rows.length;

    //*delete confirmation functions
    const handleDeleteClickOpen = () => {
        setOpen(true);
    };

    const handleDeleteClose = () => {
        setOpen(false);
    };

    //* Edit modal functions
    const handleEditClickOpen = (flashcard: FlashcardItem) => {
        setSelectedFlashcard(flashcard);
        setEditModalOpen(true);
    };

    const handleEditClose = () => {
        setEditModalOpen(false);
        setSelectedFlashcard(null);
    };

    //! close snackbar automatically
    const handleCloseSnackbar = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    //*go back functionality
    const handleGoBack = () => {
        navigate('/teacher/flashcard');
    };
    //^handle approve
    const handleApproval = async (id: string) => {
        await approveFlashCard(id);
    };
    //^handle delete from database

    const deleteChildFlashCard = async (id: string) => {
        await deleteChildFlashcards(id);
        setChildFlashcardId('');
        setOpenSnackbar(true);
    };

    //^handle edit flashcard function
    const handleUpdateFlashcard = async (data: { items: Array<{ id: string; term: string; answer: string; }>; }) => {
        console.log(data);
        await updateChildFlashCard({ flashcardId, data });
    };

    return (
        <>
            {/* table section */}
            <Box sx={{ width: '100%', height: 'auto' }}>
                <Paper variant="outlined" sx={{ width: '100%', height: '100%', borderRadius: '10px', p: 3 }}>
                    <Box component="section" sx={{ display: 'flex', gap: '20px', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', gap: '20px', }}>
                            <Button variant='outlined' sx={{ width: '36px', height: '36px', borderRadius: '8px', borderColor: "grey.700", color: "#3F3F46" }}
                                onClick={handleGoBack}
                            >
                                <ArrowBackIcon fontSize='small' />
                            </Button>
                            <Typography variant='h3'>{data?.data.title}</Typography>
                        </Box>

                        {/* buttons for pending flashcards */}
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            {(user.role === 'admin' || user.role === 'teacher') && <EditRequestButton resourceType="Flashcard" resourceId={flashcardId} />}
                            {
                                !approved && (
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Button
                                            onClick={handleGoBack}
                                            variant='outlined'
                                            sx={{ borderRadius: '8px', width: '140px', height: '48px', gap: 1 }}>
                                            <CloseIcon fontSize='small' />
                                            Decline
                                        </Button>
                                        <Button
                                            onClick={() => handleApproval(flashcardId)}
                                            variant='contained'
                                            sx={{ borderRadius: '8px', width: '140px', height: '48px', gap: 1 }}>
                                            <DoneIcon fontSize='small' />
                                            Approve
                                        </Button>
                                    </Box>
                                )
                            }
                        </Box>
                    </Box>
                    {/* flashcard author information */}
                    {
                        isAdmin && (<Box sx={{ flexGrow: 1, mb: 4 }}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <CustomLabel fieldName="Created By" />
                                    <Card sx={{ p: 1, borderRadius: 2 }} variant="outlined">{data?.data.studentId.name}</Card>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <CustomLabel fieldName="Created On" />
                                    <Card sx={{ p: 1, borderRadius: 2 }} variant="outlined">{new Date(data?.data.createdAt).toLocaleDateString()}</Card>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <CustomLabel fieldName="Approved By" />
                                    <Card sx={{ p: 1, borderRadius: 2 }} variant="outlined">{data?.data.approvedBy}</Card>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <CustomLabel fieldName="Approved On" />
                                    <Card sx={{ p: 1, borderRadius: 2 }} variant="outlined">{new Date(data?.data.updatedAt).toLocaleDateString()}</Card>
                                </Grid>
                            </Grid>
                        </Box>)
                    }

                    {/* end of flashcard author information */}

                    {/* child flashcard table starts*/}
                    {
                        !flashcardDeleteLoading && !updateLoading ? (
                            <Paper variant="outlined" sx={{ width: '100%', overflow: 'hidden', borderRadius: '10px' }}>
                                <TableContainer sx={{ maxHeight: '70vh' }}>
                                    <Table stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                {columns.map((column) => (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align}
                                                        style={{ minWidth: column.minWidth }}
                                                    >
                                                        {column.label}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((row, index: number) => {
                                                    return (
                                                        <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                                                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                                            <TableCell>{row?.term || ''}</TableCell>
                                                            <TableCell align="right">{row?.answer || ''}</TableCell>
                                                            <TableCell align="right">
                                                                <IconButton aria-label="edit flashcard"
                                                                    onClick={() => handleEditClickOpen(row)}
                                                                >
                                                                    <DriveFileRenameOutlineOutlinedIcon />
                                                                </IconButton>
                                                                <IconButton aria-label="delete flashcard"
                                                                    onClick={() => {
                                                                        handleDeleteClickOpen();
                                                                        setChildFlashcardId(row._id);
                                                                    }}
                                                                >
                                                                    <DeleteForeverOutlinedIcon />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 100]}
                                    component="div"
                                    count={totalRows}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Paper>
                        ) : (<Loader />)
                    }

                </Paper>
                {/* delete confirmation modal */}
                <DeleteConfirmation
                    type="flashcard"
                    id={childFlashcardId}
                    deleteFunction={deleteChildFlashCard}
                    handleDeleteClose={handleDeleteClose}
                    open={open}
                />
                {/* Edit flashcard modal */}
                <EditFlashcardModal
                    open={editModalOpen}
                    onClose={handleEditClose}
                    onSave={handleUpdateFlashcard}
                    flashcard={selectedFlashcard}
                />
                {/* Alert notification */}
                {/* {hasDataProperty(error) ? (
                    <Alert
                        message={error?.data.message}
                        openSnackbar={openSnackbar}
                        autoHideDuration={5000}
                        handleCloseSnackbar={handleCloseSnackbar}
                        isSuccess={false}
                    />
                ) : (
                    (deleteSuccess || updateSuccess) && (
                        <Alert
                            successMessage={message}
                            openSnackbar={openSnackbar}
                            autoHideDuration={5000}
                            handleCloseSnackbar={handleCloseSnackbar}
                            isSuccess={true}
                        />
                    )
                )} */}
                <Alert
                    successMessage={isSuccessAlert ? message : ""}
                    message={!isSuccessAlert ? (deleteErrorMessage || updateErrorMessage) : ""}
                    openSnackbar={openSnackbar}
                    autoHideDuration={5000}
                    handleCloseSnackbar={handleCloseSnackbar}
                    isSuccess={isSuccessAlert}
                />
            </Box>
        </>
    );
};

export default ChildFlashCards;