import Grid from '@mui/material/Grid2';
import CustomLabel from '../../../../../shared/components/CustomLabel';
import CustomTextField from '../../../../../shared/components/CustomTextField';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Box, Button, Divider, IconButton, Typography, MenuItem, TextField } from '@mui/material';
import { useRef, useState } from 'react';
import AlertDialog from './AlertDialog';
import { useAppSelector } from '../../../../../redux/hooks';
import { useGetCategoryByIdQuery } from '../../../../../redux/features/category/categoryApi';
import { useGetCourseByIdQuery } from '../../../../../redux/features/course/courseApi';
import Loader from '../../../../../shared/components/Loader';
import AdornedTextField from '../../../../../shared/components/AdornedTextField';
import { teal } from '@mui/material/colors';

// type declaration for props
type TTestQuestionForm = {
    handleTestQuestionInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    question: Record<string, string>;
    index: number;
    testDetails: Record<string, string>;
    numOfForms?: number;
    setNumOfForms?: React.Dispatch<React.SetStateAction<number>>;
    setImageFile: React.Dispatch<React.SetStateAction<Record<string, File | null>>>;
    imageFile: Record<string, File | null>;
    handleRemoveFile: (e: React.MouseEvent, index: number) => void;
    errors?: { [key: string]: string[]; };
};
const TestQuestionForm = (
    {
        index,
        handleTestQuestionInput,
        question,
        testDetails,
        setNumOfForms,
        numOfForms,
        setImageFile,
        imageFile,
        handleRemoveFile,
        errors
    }
        : TTestQuestionForm
) => {
    // modal state
    const [open, setOpen] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    // fetching all academic questions
    const academicFields = ['Division', 'Subject', 'Chapter'];
    const jobFields = ['Subject'];
    const admissionFields = ['Subject', 'University Name', 'University Type', 'Chapter'];

    // fetching added questions from the database
    const courseId = useAppSelector((state) => state.courseAndLessonId.id.course_id);
    const questionsFromDatabase = useAppSelector((state) => state.pickedQuestions.questions);
    // fetching the course from the id
    const { data: courseData, isLoading } = useGetCourseByIdQuery({ courseId });
    const { data: singleCategory, isLoading: categoryLoading } = useGetCategoryByIdQuery({ id: courseData?.data?.category_id });

    // array id for question added from database
    const databaseQuestionIdArray = questionsFromDatabase.map((item) => item._id);


    if (categoryLoading || isLoading) {
        return (<Loader />);
    }

    const categoryType = singleCategory?.data.type;

    // file input handler
    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files.length > 0) {
            setImageFile((prevState) => ({ ...prevState, [`${index}`]: e.target.files[0] }));
            // The following line resets input field to allow selecting the same file again
            e.target.value = '';
        }
    };

    // click on file icon
    const handleFileIconClick = () => {
        fileInputRef.current?.click();
        // setImageFile((prevState)=>({...prevState, `image_${index}`: e.target.files[0]}))
    };
    //* handler functions
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Grid size={index > 0 ? 11 : 9}>
                    <CustomLabel fieldName={`Question ${index + 1}`} />
                    {/* <CustomTextField
                        name={`title_${index}`}
                        handleInput={handleTestQuestionInput}
                        placeholder='Write your question here'
                        value={question[`title_${index}`]}
                        required={true}
                    /> */}
                    <AdornedTextField
                        name={`title_${index}`}
                        handleInput={handleTestQuestionInput}
                        handleFileIconClick={handleFileIconClick}
                        placeholder='Write your question here'
                        fileInputRef={fileInputRef}
                        required={true}
                        handleFileInput={handleFileInput}
                        value={question[`title_${index}`]}
                    />
                </Grid>
                {/* conditional rendering the upload from database button */}
                {
                    index === 0 && (
                        <Grid size={2} sx={{ display: 'flex', alignSelf: 'flex-end' }}>
                            <Button
                                onClick={handleClickOpen}
                                variant='outlined'
                                size='small'
                                sx={{ width: '100%', height: '40px', borderRadius: '8px', fontSize: '14px' }}
                            >
                                Upload from Database
                            </Button>
                        </Grid>
                    )
                }

                <Grid size={1} sx={{ display: 'flex', alignSelf: 'flex-end', justifyContent: 'right' }}>
                    <IconButton
                        disabled={numOfForms === 1 ? true : index !== numOfForms - 1 ? true : false}
                        onClick={(e) => {
                            if (numOfForms > 1) {
                                setNumOfForms(state => state - 1);
                            }
                            handleRemoveFile(e, index);
                        }}>
                        <DeleteForeverIcon />
                    </IconButton>
                </Grid>
            </Box>

            {
                imageFile[`${index}`] &&
                (
                    <Grid size={12} sx={{ mt: -2, display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: "500", bgcolor: teal[50], px: 1, py: 0.5, borderRadius: 2 }} color={teal[500]}>
                            {imageFile[`${index}`]?.name}
                        </Typography>
                        <IconButton
                            onClick={
                                (e) => {
                                    handleRemoveFile(e, index);
                                }
                            }
                        >
                            <DeleteForeverIcon />
                        </IconButton>
                    </Grid>
                )
            }

            {/* mcq row */}
            {
                (testDetails?.type === 'MCQ') && (
                    <>
                        {Array.from(Array(4)).map((item, optionIndex) => (
                            <Grid size={3} key={optionIndex}>
                                <CustomLabel fieldName={`Option ${optionIndex + 1}`} />
                                <CustomTextField
                                    name={`option${optionIndex + 1}_${index}`}
                                    handleInput={handleTestQuestionInput}
                                    placeholder={`Option ${optionIndex + 1}`}
                                    value={question[`option${optionIndex + 1}_${index}`]}
                                    error={Array.isArray(errors?.[`option${optionIndex + 1}_${index}`]) && errors?.[`option${optionIndex + 1}_${index}`].length > 0}
                                    helperText={errors?.[`option${optionIndex + 1}_${index}`]?.join(' ')}
                                />
                            </Grid>
                        ))}
                        <Grid size={12}>
                            <CustomLabel fieldName='Correct Answer' />
                            <TextField
                                select
                                fullWidth
                                name={`correctOption_${index}`}
                                value={question[`correctOption_${index}`] || ''}
                                onChange={handleTestQuestionInput}
                                error={Array.isArray(errors?.[`correctOption_${index}`]) && errors?.[`correctOption_${index}`].length > 0}
                                helperText={errors?.[`correctOption_${index}`]?.join(' ')}
                                size="small"
                                placeholder='Select the correct answer'
                                sx={{
                                    mt: 1,
                                    backgroundColor: '#F9FAFB',
                                    borderRadius: 1.5,
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#E5E7EB',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#E5E7EB',
                                        },
                                    }
                                }}
                            >
                                {[1, 2, 3, 4].map((optIndex) => {
                                    const optionValue = question[`option${optIndex}_${index}`];
                                    if (!optionValue) return null; // Don't show empty options
                                    return (
                                        <MenuItem key={optIndex} value={optionValue}>
                                            {optionValue}
                                        </MenuItem>
                                    );
                                })}
                                {/* Show a placeholder if no options are filled yet */}
                                {![1, 2, 3, 4].some(optIndex => question[`option${optIndex}_${index}`]) && (
                                    <MenuItem value="" disabled>Please fill in options first</MenuItem>
                                )}
                            </TextField>
                        </Grid>
                    </>
                )
            }
            {/* mcq row ends */}
            {/* question description */}
            <Grid size={12}>
                <CustomLabel fieldName='Answer Description' />
                <CustomTextField
                    name={`description_${index}`}
                    handleInput={handleTestQuestionInput}
                    placeholder="Explain the answer here"
                    value={question[`description_${index}`]}
                    multiline={true}
                    rows={4}
                    required={true}
                />
            </Grid>

            {/* question added from database */}

            <Grid size={12}>
                <Divider />
            </Grid>

            {/* modal for question adding */}
            <AlertDialog
                singleCategory={singleCategory.data}
                categoryType={categoryType}
                open={open}
                handleClose={handleClose}
                academicFields={academicFields}
                jobFields={jobFields}
                admissionFields={admissionFields}
                databaseQuestionIdArray={databaseQuestionIdArray}
            />
        </>
    );
};

export default TestQuestionForm;