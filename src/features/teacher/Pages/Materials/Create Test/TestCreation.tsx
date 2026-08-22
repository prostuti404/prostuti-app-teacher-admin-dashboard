import { Box, Button, Paper, Typography, styled, Snackbar, Alert } from "@mui/material";
import { DatabaseQuestionViewer, CustomLabel, CustomTextField, TestQuestionForm, Loader, testQuestionFormation, questionIdArrayFormation, useCreateTestMutation, resetStoredQuestions, useAppDispatch, useAppSelector, useGetLessonsByCourseIdQuery, CustomAutoComplete, Grid, ArrowBackIcon, QuestionType, testTime, CloudUploadIcon, Divider, AdapterDayjs, LocalizationProvider, Dayjs, useState } from '../Create Test';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useNavigate } from "react-router-dom";
import { usePreviousPath } from "../../../../../lib/Providers/NavigationProvider";

const StyledDatePicker = styled(DateTimePicker)({
    width: '100%',
    '& .MuiInputBase-root': {
        height: '40px',
        borderRadius: '8px',
        fontSize: '0.875rem',
    }
});

const TestCreation = () => {
    // local states
    const [testDetails, setTestDetails] = useState<Record<string, string>>({});
    const [numOfForms, setNumOfForms] = useState(1);
    const [question, setQuestion] = useState<Record<string, string>>({});
    const [imageFile, setImageFile] = useState<Record<string, File | null>>({});
    const [errors, setErrors] = useState<{ [key: string]: string[]; }>({});
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    // tracking previous path
    const { previousPath } = usePreviousPath();
    const navigate = useNavigate();
    // fetching courseId from the local redux store
    const courseId = useAppSelector((state) => state.courseAndLessonId.id.course_id);
    const questionsSelectedFromDatabase = useAppSelector((state) => state.pickedQuestions.questions);
    const dispatch = useAppDispatch();
    const selectedDatabaseQuestionId = questionsSelectedFromDatabase.map((question) => question._id);
    // api calls via redux toolkit
    const { data: lessonData, isLoading: lessonLoading } = useGetLessonsByCourseIdQuery({ courseId });
    const [createTest, { isLoading: testCreationLoader }] = useCreateTestMutation();

    // loaders 
    if (testCreationLoader || lessonLoading) {
        return <Loader />;
    }
    // data filtering
    const lessonNames = lessonData?.data.map((item: typeof lessonData) => item.name);
    const lesson_id = lessonData?.data.filter((item: typeof lessonData) => item.name === testDetails?.lessonName);

    //^ handling dayjs for date field
    const handleDateChange = (date: Dayjs | null) => {
        if (date) {
            setTestDetails({ ...testDetails, publishDate: date.toISOString() }); // converting date to iso string
        }
    };

    //~ handling all the inputs
    const handleTestDetailsInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTestDetails((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleTestQuestionInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setQuestion((prevState) => ({ ...prevState, [name]: value }));
    };

    // removing the selected file

    const handleRemoveFile = (e: React.MouseEvent, index) => {
        setImageFile((prev) => {
            const updatedFiles = { ...prev };
            delete updatedFiles[`${index}`];
            return updatedFiles;
        });
    };

    // Validation function
    const validateTestDetails = () => {
        const newErrors: { [key: string]: string[]; } = {};
        let isValid = true;

        // Validate lesson name
        if (!testDetails?.lessonName?.trim()) {
            newErrors.lessonName = ['Lesson name is required'];
            isValid = false;
        }

        // Validate test name
        if (!testDetails?.name?.trim()) {
            newErrors.name = ['Test name is required'];
            isValid = false;
        }

        // Validate test type
        if (!testDetails?.type?.trim()) {
            newErrors.type = ['Test type is required'];
            isValid = false;
        }

        // Validate test time
        if (!testDetails?.time?.trim()) {
            newErrors.time = ['Test time is required'];
            isValid = false;
        }

        // Validate test date
        if (!testDetails?.publishDate) {
            newErrors.publishDate = ['Test date is required'];
            isValid = false;
        }

        // Validate questions
        if (Object.keys(question).length === 0 && questionsSelectedFromDatabase.length === 0) {
            newErrors.questions = ['At least one question is required'];
            isValid = false;
        }

        // Validate question details
        for (let i = 0; i < numOfForms; i++) {
            const title = question[`title_${i}`]?.trim();
            if (!title) {
                newErrors[`title_${i}`] = ['Question title is required'];
                isValid = false;
            }

            if (testDetails?.type === 'MCQ') {
                const options = [];
                for (let j = 1; j <= 4; j++) {
                    const option = question[`option${j}_${i}`]?.trim();
                    if (option) {
                        options.push(option);
                    }
                }
                
                if (options.length < 2) {
                    newErrors[`option1_${i}`] = ['At least 2 options are required'];
                    isValid = false;
                }

                const correctAnswer = question[`correctOption_${i}`]?.trim();
                if (!correctAnswer) {
                    newErrors[`correctOption_${i}`] = ['Correct answer is required'];
                    isValid = false;
                } else if (!options.includes(correctAnswer)) {
                    newErrors[`correctOption_${i}`] = ['Correct answer must match one of the provided options'];
                    isValid = false;
                }
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    // Handle snackbar close
    const handleSnackbarClose = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    //*handle submit function
    const handleTestSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateTestDetails()) {
            setSnackbar({
                open: true,
                message: 'Please fill out all required fields',
                severity: 'error'
            });
            return;
        }

        const testData = new FormData();
        const questionList = testQuestionFormation(question, testDetails?.type);
        const questionsFromDatabase = questionIdArrayFormation(selectedDatabaseQuestionId);

        const finalQuestionList = [...questionsFromDatabase, ...questionList];
        const convertedTime = Number(testDetails?.time.slice(0, 2));

        const submittableData = {
            name: testDetails?.name,
            course_id: courseId,
            lesson_id: lesson_id[0]._id,
            type: testDetails?.type,
            time: convertedTime,
            publishDate: testDetails?.publishDate,
            questionList: finalQuestionList
        };

        testData.append('data', JSON.stringify(submittableData));

        if (Object.keys(imageFile).length !== 0) {
            for (const key in imageFile) {
                if (imageFile[key] !== null) {
                    testData.append(`image${key}`, imageFile[key]);
                }
            }
        }

        try {
            await createTest(testData).unwrap();
            setSnackbar({
                open: true,
                message: 'Test created successfully',
                severity: 'success'
            });
            setTestDetails({});
            setQuestion({});
            setImageFile({});
            setNumOfForms(1);
            dispatch(resetStoredQuestions());
        } catch (err) {
            console.log(err);
            const errorMap: { [key: string]: string[]; } = {};
            const errorMsgs: string[] = [];
            const errorSources = err?.data?.errorSources;

            if (errorSources && Array.isArray(errorSources)) {
                errorSources.forEach((source: { path: string, message: string; }) => {
                    if (!errorMap[source.path]) errorMap[source.path] = [];
                    errorMap[source.path].push(source.message);
                    errorMsgs.push(source.message);
                });

                setErrors(errorMap);
                setSnackbar({
                    open: true,
                    message: errorMsgs.join(', '),
                    severity: 'error'
                });
            } else {
                setSnackbar({
                    open: true,
                    message: 'Failed to create test',
                    severity: 'error'
                });
            }
        }
    };

    console.log('selected image object for test questions:', imageFile);

    return (
        <>
            <Box sx={{ width: '100%', height: numOfForms === 1 ? '100vh' : 'auto' }}>
                <Paper variant="outlined" sx={{ width: '100%', height: 'auto', borderRadius: '10px', p: 3 }}>
                    {/* top title and button section */}
                    <Box component="section" sx={{ display: 'flex', gap: '20px', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        {/* back button and title */}
                        <Box component="section" sx={{ display: 'flex', gap: '20px' }}>
                            {/* <Link to='/teacher/create-course/add-course-material'> */}
                            <Button variant='outlined'
                                onClick={() => navigate(previousPath || '/teacher/create-course/add-course-material')}
                                sx={{ width: '36px', height: '36px', minWidth: '36px', borderRadius: '8px', borderColor: "grey.700", color: "#3F3F46" }}>
                                <ArrowBackIcon fontSize='small' />
                            </Button>
                            {/* </Link> */}
                            <Typography variant='h3'>Test Creation</Typography>
                        </Box>
                        {/* continue button */}
                        {/* <Link to='/teacher/create-course/add-course-lessons'> */}
                        {/* <Button
                            // onClick={handleContinue}
                            variant='contained'
                            sx={{ borderRadius: '8px', width: '140px', height: '48px' }}>
                            Continue <ChevronRightIcon />
                        </Button> */}
                        {/* </Link> */}
                    </Box>
                    {/* form section starts here */}
                    <Box sx={{ display: "flex", flexDirection: 'column', gap: '20px' }}>
                        <form onSubmit={handleTestSubmit}>
                            <Paper variant='outlined' sx={{ width: '100%', height: '100%', p: 2, borderRadius: '8px', mb: 3 }}>
                                <Grid container spacing={3}>
                                    {/* first row-> lesson name */}
                                    <Grid size={12}>
                                        <CustomLabel fieldName="Lesson Name" />
                                        <CustomAutoComplete
                                            name='lessonName'
                                            options={lessonNames}
                                            value={testDetails?.lessonName}
                                            handleInput={handleTestDetailsInput}
                                            error={Array.isArray(errors.lessonName) && errors.lessonName.length > 0}
                                            helperText={errors.lessonName?.join(' ')}
                                        />
                                    </Grid>
                                    {/* 2nd row --> , , total question, test date */}
                                    {/* test name */}
                                    <Grid size={3}>
                                        <CustomLabel fieldName="Test Name" />
                                        <CustomTextField
                                            name="name"
                                            value={testDetails?.name}
                                            handleInput={handleTestDetailsInput}
                                            placeholder="Enter the test name"
                                            error={Array.isArray(errors.name) && errors.name.length > 0}
                                            helperText={errors.name?.join(' ')}
                                        />
                                    </Grid>
                                    {/* test type */}
                                    <Grid size={3}>
                                        <CustomLabel fieldName="Test Type" />
                                        <CustomAutoComplete
                                            name="type"
                                            options={QuestionType}
                                            value={testDetails?.type}
                                            handleInput={handleTestDetailsInput}
                                            error={Array.isArray(errors.type) && errors.type.length > 0}
                                            helperText={errors.type?.join(' ')}
                                        />
                                    </Grid>
                                    {/* test time */}
                                    <Grid size={3}>
                                        <CustomLabel fieldName="Test Time" />
                                        <CustomAutoComplete
                                            name="time"
                                            options={testTime}
                                            value={testDetails?.time}
                                            handleInput={handleTestDetailsInput}
                                            error={Array.isArray(errors.time) && errors.time.length > 0}
                                            helperText={errors.time?.join(' ')}
                                        />
                                    </Grid>
                                    {/* Test date */}
                                    <Grid size={3} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <CustomLabel fieldName="Test Date" />
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <StyledDatePicker
                                                onChange={handleDateChange}
                                                slotProps={{
                                                    textField: {
                                                        error: Array.isArray(errors.publishDate) && errors.publishDate.length > 0,
                                                        helperText: errors.publishDate?.join(' ')
                                                    }
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid size={12}>
                                        <Divider />
                                    </Grid>

                                    {/* questions forms */}
                                    {/* dynamic form of to add question for the test */}
                                    <>
                                        {
                                            Array.from(Array(numOfForms)).map((_, index) => (
                                                <TestQuestionForm
                                                    key={index}
                                                    question={question}
                                                    handleTestQuestionInput={handleTestQuestionInput}
                                                    index={index}
                                                    testDetails={testDetails}
                                                    setNumOfForms={setNumOfForms}
                                                    numOfForms={numOfForms}
                                                    setImageFile={setImageFile}
                                                    imageFile={imageFile}
                                                    handleRemoveFile={handleRemoveFile}
                                                    errors={errors}
                                                />
                                            ))
                                        }
                                    </>
                                    {/* divider after question ends */}
                                    <Grid size={12}>
                                        <Divider />
                                    </Grid>
                                </Grid>
                                {/* form buttons */}
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: "20px", mt: 3, }}>
                                    <Button
                                        onClick={() => {
                                            setNumOfForms((prevState) => prevState + 1);
                                        }}
                                        variant='outlined'
                                        size='small'
                                        sx={{ width: '167px', height: '40px', borderRadius: '8px', fontSize: '14px', zIndex: 3 }}
                                    >
                                        + Add New Question
                                    </Button>
                                </Box>
                                <Grid size={12} sx={{ my: 3 }}>
                                    <Divider />
                                </Grid>
                                {/* question selected from database */}
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant='h5' align="center">Questions Selected From Database</Typography>
                                    <DatabaseQuestionViewer questionArr={questionsSelectedFromDatabase} />
                                </Box>
                                {/* upload test */}
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: "20px", mt: 3 }}>
                                    <Button
                                        variant='contained'
                                        size='small'
                                        type="submit"
                                        sx={{ width: '167px', height: '40px', borderRadius: '8px', fontSize: '14px' }}
                                        startIcon={<CloudUploadIcon />}
                                    >
                                        Upload Test
                                    </Button>
                                </Box>
                            </Paper>
                        </form>
                    </Box>
                </Paper>
            </Box>

            {/* Success/Error Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default TestCreation;