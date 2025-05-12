import { Box, Button, Paper, SnackbarCloseReason, Typography, Snackbar, Alert as MuiAlert } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from "react-router-dom";
import AddQuestionForm from "./AddQuestionForm";
import { useState } from "react";
import Grid from '@mui/material/Grid2';
import { formatQuestion } from "../../../../../utils/questionFormation";
import { useCreateQuestionMutation } from "../../../../../redux/features/question/questionApi";
import Loader from "../../../../../shared/components/Loader";

const AddQuestion = () => {
    const [numOfForms, setNumOfForms] = useState(1);
    const [question, setQuestion] = useState<Record<string, string>>({});
    const [imageFile, setImageFile] = useState<Record<string, File | null>>({});
    const [category_id, setCategory_id] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    // redux api call
    const [createQuestion, { error, isLoading }] = useCreateQuestionMutation();

    // formatting question object to question array
    const questionArray = formatQuestion(question, category_id);

    // Validate MCQ options and correct answer
    const validateMCQOptions = () => {
        for (let i = 0; i < numOfForms; i++) {
            if (question[`type_${i}`] === 'MCQ') {
                const options = [];
                for (let j = 1; j <= 4; j++) {
                    const option = question[`option${j}_${i}`]?.trim();
                    if (option) {
                        options.push(option);
                    }
                }
                const correctAnswer = question[`correctOption_${i}`]?.trim();

                if (correctAnswer && !options.includes(correctAnswer)) {
                    setSnackbar({
                        open: true,
                        message: `Correct answer for question ${i + 1} must match one of the provided options`,
                        severity: 'error'
                    });
                    return false;
                }
            }
        }
        return true;
    };

    // temporary array
    const handleAddQuestion = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate MCQ options before submitting
        if (!validateMCQOptions()) {
            return;
        }

        checkImageFileAsFormData(imageFile);
        console.log(questionArray);

        const questionData = new FormData();

        questionData.append('data', JSON.stringify(questionArray));

        // checking whether file object not empty
        if (Object.keys(imageFile).length !== 0) {
            for (const key in imageFile) {
                // checking whether a key has null value in the object
                if (imageFile[key] !== null) {
                    questionData.append(`image${key}`, imageFile[key]);
                }
            }
        }

        try {
            await createQuestion(questionData).unwrap();
            setSnackbar({
                open: true,
                message: 'Question(s) added successfully',
                severity: 'success'
            });
            setQuestion({});
            setImageFile({});
            setNumOfForms(1);
        } catch (err) {
            console.log(err);
            setSnackbar({
                open: true,
                message: 'Failed to add question(s)',
                severity: 'error'
            });
        }
    };

    // close snackbar automatically
    const handleCloseSnackbar = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const checkImageFileAsFormData = (fileObj: typeof imageFile) => {
        const imageData = new FormData();
        for (const key in fileObj) {
            imageData.append(`image${key}`, fileObj[key]);
        }

        console.log('Appended images', imageData.get("image2"));

    };

    // removing the selected file
    const handleRemoveFile = (e: React.MouseEvent, index) => {
        setImageFile((prev) => {
            const updatedFiles = { ...prev };
            delete updatedFiles[`${index}`];
            return updatedFiles;
        });
    };

    // loading screen until all the data are fetched
    if (isLoading) {
        return (<Loader />);
    }

    if (error) {
        console.log(error);
    }

    console.log('image object:', imageFile);

    // console.log('from add question page', questionArr);
    return (
        <>
            <Box sx={{ width: '100%', height: numOfForms <= 1 ? '100vh' : 'auto' }}>
                <Paper variant="outlined" sx={{ width: '100%', height: 'auto', borderRadius: '10px', p: 3 }}>
                    {/* top title and button section */}
                    <Box component="section" sx={{ display: 'flex', gap: '20px', justifyContent: 'flex-start', alignItems: 'center', mb: 3 }}>
                        <Link to='/teacher/question-database'>
                            <Button variant='outlined' sx={{ width: '36px', minWidth: '36px', height: '36px', borderRadius: '8px', borderColor: "grey.700", color: "#3F3F46" }}>
                                <ArrowBackIcon fontSize='small' />
                            </Button>
                        </Link>
                        <Typography variant='h3'>Add Question</Typography>
                    </Box>
                    {/* dynamic form component*/}
                    <Box sx={{ display: "flex", flexDirection: 'column', gap: '20px', position: 'relative' }}>
                        <form onSubmit={handleAddQuestion}>
                            {
                                Array.from(Array(numOfForms)).map((_, index) => (
                                    <Paper key={index} variant='outlined' sx={{ width: '100%', height: '100%', p: 2, borderRadius: '8px', mb: 3 }}>
                                        <Grid container spacing={2} >
                                            <Button
                                                onClick={(e) => {
                                                    setNumOfForms((prev) => prev - 1);
                                                    handleRemoveFile(e, index);
                                                }}
                                                variant="outlined"
                                                size="small"
                                                sx={{ borderRadius: '5px', width: '15px', minWidth: '15px', height: '15px', borderColor: "grey.700", color: "#3F3F46", position: 'absolute', right: '20px', p: 1, }}>
                                                X
                                            </Button>
                                            <AddQuestionForm
                                                handleRemoveFile={handleRemoveFile}
                                                index={index}
                                                question={question}
                                                setQuestion={setQuestion}
                                                setCategory_id={setCategory_id}
                                                setImageFile={setImageFile}
                                                imageFile={imageFile}
                                            />
                                        </Grid>
                                    </Paper>
                                ))
                            }
                            {/* form buttons */}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: "20px", mt: 3 }}>
                                <Button
                                    onClick={() => {
                                        setNumOfForms((prevState) => prevState + 1);
                                    }}
                                    variant='outlined'
                                    size='small'
                                    sx={{ width: '167px', height: '40px', borderRadius: '8px', fontSize: '14px' }}>
                                    + Add New Question
                                </Button>
                                <Button
                                    variant='contained'
                                    size='small'
                                    type="submit"
                                    sx={{ width: '167px', height: '40px', borderRadius: '8px', fontSize: '14px' }}>
                                    + Add to Database
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Paper>
            </Box>

            {/* Success/Error Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <MuiAlert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </MuiAlert>
            </Snackbar>
        </>
    );
};

export default AddQuestion;