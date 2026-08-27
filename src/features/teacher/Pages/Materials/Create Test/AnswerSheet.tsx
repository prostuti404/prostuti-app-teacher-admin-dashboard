import { Box, Button, Card, Paper, Typography, styled, IconButton, Alert, Snackbar } from "@mui/material";
import { CustomLabel, CustomTextField, useAppSelector, Link, Grid, ArrowBackIcon, Divider, LocalizationProvider, DatePicker, useParams } from '../Create Test';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import dayjs from "dayjs";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { downloadFile } from "../../../../../utils/FileDownload";
import { useState, useEffect } from "react";
import { useSubmitWrittenTestMarksMutation } from "../../../../../redux/features/materials/materialsApi";

const StyledDatePicker = styled(DatePicker)({
    width: '100%',
    '& .MuiInputBase-root': {
        height: '40px',
        borderRadius: '8px',
        fontSize: '0.875rem',
    }
});

const AnswerSheet = () => {
    // const test_id = useAppSelector(state => state.test_id.id.test_id);
    const [marking, setMarking] = useState<Record<string, string | number>>({});
    const { testHistoryId } = useParams();
    const testHistoryData = useAppSelector(state => state.test_id.testHistoryData.history);
    console.log("testHistoryData", testHistoryData);
    const [submitWrittenTestMarks, { isLoading, isSuccess, isError }] = useSubmitWrittenTestMarksMutation();
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState({ type: 'success', message: '' });

    // Initialize marking state with default values when data loads
    useEffect(() => {
        if (testHistoryData?.answers?.length > 0) {
            const initialMarks: Record<string, string | number> = {};
            testHistoryData.answers.forEach((answer, index) => {
                initialMarks[`mark_${index}`] = answer.mark || "";
            });
            setMarking(initialMarks);
        }
    }, [testHistoryData]);

    // Handle result of submission attempt
    useEffect(() => {
        if (isSuccess) {
            setAlertMessage({
                type: 'success',
                message: 'Marking submitted successfully',
            });
            setShowAlert(true);
        } else if (isError) {
            setAlertMessage({
                type: 'error',
                message: 'Failed to submit marking. Please try again.'
            });
            setShowAlert(true);
        }
    }, [isSuccess, isError]);

    const handleMarking = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMarking((prev) => ({ ...prev, [name]: value }));
    };

    const handleMarkSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        // Format data for submission
        const formattedAnswers = testHistoryData.answers.map((answer, index) => {
            return {
                question_id: answer.question_id._id, // Extract the question ID
                selectedOption: answer.selectedOption,
                mark: Number(marking[`mark_${index}`]) || 0 // Convert to number or default to 0
            };
        });

        // Prepare payload for API call
        const payload = {
            test_history_id: testHistoryId,
            test_id: testHistoryData.test_id._id,
            answers: formattedAnswers
        };

        // Submit to API
        submitWrittenTestMarks(payload);
    };

    // Function to determine styling based on whether an option is correct or incorrectly selected
    const getOptionStyle = (option, correctOption, selectedOption) => {
        if (option === correctOption) {
            // Correct answer gets green background
            return {
                borderRadius: '8px',
                backgroundColor: '#A2F3AB',
                borderColor: '#4caf50',
                color: '#1e4620'
            };
        } else if (option === selectedOption && selectedOption !== correctOption) {
            // Incorrect selected answer gets red background
            return {
                borderRadius: '8px',
                backgroundColor: '#FEC9CA',
                borderColor: '#f44336',
                color: '#7f0000'
            };
        }
        // Default style for other options
        return {};
    };

    return (
        <>
            <Box sx={{ width: '100%', height: 'auto' }}>
                {/* Show alert for success/failure */}
                <Snackbar
                    open={showAlert}
                    autoHideDuration={6000}
                    onClose={() => setShowAlert(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert
                        severity={alertMessage.type as 'success' | 'error'}
                        onClose={() => setShowAlert(false)}
                    >
                        {alertMessage.message}
                    </Alert>
                </Snackbar>

                <Paper variant="outlined" sx={{ width: '100%', height: 'auto', borderRadius: '10px', p: 3 }}>
                    {/* top title and button section */}
                    <Box component="section" sx={{ display: 'flex', gap: '20px', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        {/* back button and title */}
                        <Box component="section" sx={{ display: 'flex', gap: '20px' }}>
                            <Link to='/teacher/test-list'>
                                <Button variant='outlined' sx={{ width: '36px', height: '36px', minWidth: '36px', borderRadius: '8px', borderColor: "grey.700", color: "#3F3F46" }}>
                                    <ArrowBackIcon fontSize='small' />
                                </Button>
                            </Link>
                            <Typography variant='h3'>Answer Sheet</Typography>
                        </Box>
                        {/* continue button */}
                        <Box sx={{ display: 'flex', gap: '20px' }}>
                            <>
                                <Button
                                    onClick={handleMarkSubmit}
                                    variant='contained'
                                    disabled={isLoading}
                                    sx={{ borderRadius: '8px', width: 'auto', height: '48px' }}>
                                    {isLoading ? 'Submitting...' : 'Confirm Marking'}<ChevronRightIcon />
                                </Button>
                            </>
                        </Box>
                    </Box>
                    {/* answer sheet with student information */}
                    <Paper variant='outlined' sx={{ width: '100%', height: '100%', p: 2, borderRadius: '8px', mb: 3 }}>
                        <Box sx={{ display: "flex", flexDirection: 'column', gap: '20px' }}>
                            <Grid container spacing={3}>
                                {/* 2nd row --> , , total question, test date */}
                                {/* student name */}
                                <Grid size={6}>
                                    <CustomLabel fieldName="Student Name" />
                                    <CustomTextField
                                        name="name"
                                        value={testHistoryData?.student_id.name}
                                        placeholder="Enter the test name"
                                    />
                                </Grid>
                                {/* student ID */}
                                <Grid size={6}>
                                    <CustomLabel fieldName="Student ID" />
                                    <CustomTextField
                                        disabled={true}
                                        name="type"
                                        value={testHistoryData?.student_id.user_id}
                                    />
                                </Grid>
                                {/* 2nd row --> , , total question, test date */}
                                {/* test name */}
                                <Grid size={2.4}>
                                    <CustomLabel fieldName="Test Name" />
                                    <CustomTextField
                                        name="name"
                                        value={testHistoryData?.test_id?.name}
                                        placeholder="Enter the test name"
                                    />
                                </Grid>
                                {/* Test date */}
                                <Grid size={2.4} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <CustomLabel fieldName="Test Date" />
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <StyledDatePicker
                                            value={testHistoryData.test_id.publishDate ? dayjs(testHistoryData.test_id.publishDate) : null}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                {/* Submission time */}
                                <Grid size={2.4} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <CustomLabel fieldName="Submission Date" />
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <StyledDatePicker
                                            value={testHistoryData.updatedAt ? dayjs(testHistoryData.updatedAt) : null}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                {/* Test Type */}
                                <Grid size={2.4} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <CustomLabel fieldName="Test Type" />
                                    <CustomTextField
                                        disabled={true}
                                        name="testType"
                                        type="text"
                                        value={testHistoryData.test_id.type}
                                    />
                                </Grid>

                                {/* question count */}
                                <Grid size={2.4} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <CustomLabel fieldName="Total Questions" />
                                    <CustomTextField
                                        disabled={true}
                                        name="questionCount"
                                        type="text"
                                        value={testHistoryData.test_id.questionList.length}
                                    />
                                </Grid>
                                {/* 3rd row */}
                                {/* correct count */}
                                <Grid size={3} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <CustomLabel fieldName="Correct" />
                                    <CustomTextField
                                        disabled={true}
                                        name="correctAnswer"
                                        type="text"
                                        value={String(testHistoryData.rightScore)}
                                    />
                                </Grid>
                                {/* incorrect count */}
                                <Grid size={3} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <CustomLabel fieldName="Wrong" />
                                    <CustomTextField
                                        disabled={true}
                                        name="correctAnswer"
                                        type="text"
                                        value={String(testHistoryData.wrongScore)}
                                    />
                                </Grid>
                                {/* skip */}
                                <Grid size={3} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <CustomLabel fieldName="Total Score" />
                                    <CustomTextField
                                        disabled={true}
                                        name="totalScore"
                                        type="text"
                                        value={String(testHistoryData.totalScore)}
                                    />
                                </Grid>
                                {/* total score */}
                                <Grid size={3} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <CustomLabel fieldName="Final Score" />
                                    <CustomTextField
                                        disabled={true}
                                        name="finalScore"
                                        type="text"
                                        value={String(testHistoryData.score)}
                                    />
                                </Grid>
                                {/* divider after each question */}
                                <Grid size={12} sx={{ mt: 1 }}>
                                    <Divider />
                                </Grid>
                                {/* question list */}
                                {
                                    testHistoryData.answers.map((answer, questionIndex) => {
                                        return (
                                            <>
                                                <Grid size={10}>
                                                    <CustomLabel fieldName={`Question No ${questionIndex + 1}`} />
                                                    <CustomTextField
                                                        disabled={true}
                                                        name={`question${questionIndex}`}
                                                        type="text"
                                                        value={answer.question_id.title}
                                                    />
                                                </Grid>
                                                <Grid size={2}>
                                                    <CustomLabel fieldName={`Give Marks`} />
                                                    <CustomTextField
                                                        disabled={answer.question_id.type !== 'Written'}
                                                        name={`mark_${questionIndex}`}
                                                        type="number"
                                                        value={marking[`mark_${questionIndex}`] || ""}
                                                        handleInput={handleMarking}
                                                    />
                                                </Grid>
                                                {/* for mcq test */}
                                                {answer.question_id.options &&
                                                    (answer.question_id?.options.map((option, optionIndex) => (
                                                        <Grid size={3} key={optionIndex}>
                                                            <CustomTextField
                                                                disabled={true}
                                                                name={`options${optionIndex}`}
                                                                type="text"
                                                                value={option}
                                                                style={getOptionStyle(
                                                                    option,
                                                                    answer.question_id.correctOption,
                                                                    answer.selectedOption
                                                                )}
                                                            />
                                                        </Grid>
                                                    )))
                                                }
                                                {/* Display written answer */}
                                                {answer.question_id.type === 'Written' && (
                                                    <Grid size={12} sx={{ mt: 1 }}>
                                                        <CustomLabel fieldName="Student's Answer" />
                                                        <Paper
                                                            variant="outlined"
                                                            sx={{
                                                                p: 2,
                                                                borderRadius: '8px',
                                                                backgroundColor: '#f5f5f5',
                                                                minHeight: '100px'
                                                            }}
                                                        >
                                                            <Typography>{answer.selectedOption || "No answer provided"}</Typography>
                                                        </Paper>
                                                    </Grid>
                                                )}
                                                {/* submitted attachments */}
                                                <Grid size={12} sx={{ zIndex: 3, mt: 2 }}>
                                                    {
                                                        answer.question_id?.image?.originalName ? (
                                                            <Card variant="outlined"
                                                                sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: 'space-evenly', gap: 2, mt: 0.8, px: 1.5, py: 2, borderRadius: 2 }}>
                                                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                                    <img src={answer.question_id?.image?.path}
                                                                        style={{
                                                                            borderRadius: "8px",
                                                                            objectFit: 'cover',
                                                                            width: '100%',
                                                                            height: '340px'
                                                                        }}
                                                                    />

                                                                </Box>
                                                                <Typography variant="h6" color="grey.500">
                                                                    {answer.question_id?.image?.originalName}
                                                                </Typography>
                                                                <IconButton
                                                                    onClick={() => downloadFile(answer.question_id?.image?.path, answer.question_id?.image?.originalName)}
                                                                >
                                                                    <FileDownloadOutlinedIcon />
                                                                </IconButton>
                                                            </Card>
                                                        ) : null
                                                    }
                                                </Grid>
                                                {/* Add divider between questions */}
                                                <Grid size={12} sx={{ mt: 2, mb: 2 }}>
                                                    <Divider />
                                                </Grid>
                                            </>
                                        );
                                    })
                                }
                            </Grid>
                        </Box>
                    </Paper>
                </Paper>
            </Box>
        </>
    );
};

export default AnswerSheet;