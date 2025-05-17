import CustomAutoComplete from "../../../../../shared/components/CustomAutoComplete";
import CustomLabel from "../../../../../shared/components/CustomLabel";
import { QuestionCategory, QuestionType } from "../../../../../utils/Constants";
import Grid from '@mui/material/Grid2';
import CustomTextField from "../../../../../shared/components/CustomTextField";
import { useGetCategoryQuery } from "../../../../../redux/features/question/questionApi";
import Loader from "../../../../../shared/components/Loader";
import { FormControl, MenuItem, TextField, Typography, IconButton, Snackbar, Alert } from "@mui/material";
import { getUniqueStrings } from "../../../../../utils/typeSafeUniqueArrays";
import AdornedTextField from "../../../../../shared/components/AdornedTextField";
import { useRef, useState, useEffect } from "react";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { teal } from "@mui/material/colors";

// type declaration
type TAddQuestionForm = {
    index: number;
    setQuestion: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    question: Record<string, string>;
    setCategory_id: React.Dispatch<React.SetStateAction<string>>;
    setImageFile: React.Dispatch<React.SetStateAction<Record<string, File | null>>>;
    imageFile: Record<string, File | null>;
    handleRemoveFile: (e: React.MouseEvent, index: number) => void;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
};

const AddQuestionForm = ({ index, setQuestion, question, setCategory_id, setImageFile, imageFile, handleRemoveFile, onSuccess, onError }: TAddQuestionForm) => {
    // Snackbar state
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    // Handle snackbar close
    const handleSnackbarClose = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    // creating a reference to capture value of input field
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileIconClick = () => {
        fileInputRef.current?.click();
    };

    // question type selection
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setQuestion((prevState) => ({ ...prevState, [name]: value }));
        setCategory_id(categoryId);
    };

    // file selection
    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files.length > 0) {
            setImageFile((prevState) => ({ ...prevState, [`${index}`]: e.target.files[0] }));
            // The following line resets input field to allow selecting the same file again
            e.target.value = '';
        }
    };

    // creating a query parameter object
    const categoryQueryParams = {
        ...(question.category && { category: question.category }),
        ...(question.division && { division: question.division }),
        ...(question.subject && { subject: question.subject }),
        ...(question.chapter && { chapter: question.chapter }),
        ...(question.universityName && { universityName: question.universityName }),
        ...(question.universityType && { universityType: question.universityType }),
        ...(question.unit && { unit: question.unit }),
        ...(question.jobType && { jobType: question.jobType }),
        ...(question.jobName && { jobName: question.jobName }),
    };

    // redux api call
    const { data: categoryData, isLoading, error } = useGetCategoryQuery(categoryQueryParams);

    // Handle error state
    useEffect(() => {
        if (error) {
            setSnackbar({
                open: true,
                message: 'Failed to fetch category data',
                severity: 'error'
            });
            onError?.(error as Error);
        }
    }, [error, onError]);

    // Handle success state
    useEffect(() => {
        if (categoryData?.data) {
            setSnackbar({
                open: true,
                message: 'Category data loaded successfully',
                severity: 'success'
            });
            onSuccess?.();
        }
    }, [categoryData, onSuccess]);

    if (isLoading) {
        return <Loader />;
    }

    // extracting divisions subjects, chapter, universityType, universityName, from the category data and creating unique array. The getUniqueStrings is a custom function helping to provide type safety.
    const divisions = getUniqueStrings(categoryData?.data || [], 'division');
    const subjects = getUniqueStrings(categoryData?.data || [], 'subject');
    const chapters = getUniqueStrings(categoryData?.data || [], 'chapter');
    const universityTypes = getUniqueStrings(categoryData?.data || [], 'universityType');
    const universityNames = getUniqueStrings(categoryData?.data || [], 'universityName');
    const units = getUniqueStrings(categoryData?.data || [], 'unit');
    const jobTypes = getUniqueStrings(categoryData?.data || [], 'jobType');
    const jobNames = getUniqueStrings(categoryData?.data || [], 'jobName');

    // narrowed down category
    const categoryId = categoryData?.data[0]?._id || '';

    return (
        <>
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

            {/* choosing the question category field */}
            {index === 0 &&
                (<Grid size={6}>
                    <CustomLabel fieldName="Category" />
                    <FormControl fullWidth>
                        <TextField
                            name={`category`}
                            // value={age}
                            onChange={(e) => {
                                setQuestion({});
                                setQuestion((prevState) => ({
                                    ...prevState,
                                    [`category`]: e.target.value,
                                }));
                            }}
                            size="small"
                            select
                            required={true}
                            sx={{
                                mt: 0.8,
                                "& .MuiOutlinedInput-root": {
                                    color: "grey.500",
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderRadius: "8px",
                                    }
                                }
                            }}
                        >
                            {
                                QuestionCategory.map((itemName) => (
                                    <MenuItem key={itemName} value={itemName}>
                                        {itemName}
                                    </MenuItem>
                                ))
                            }
                        </TextField>
                    </FormControl>
                </Grid >)
            }
            {/* question type selection */}
            <Grid size={index === 0 ? 6 : 12}>
                <CustomLabel fieldName="Question Type" />
                <CustomAutoComplete
                    options={QuestionType}
                    handleInput={handleInput}
                    name={`type_${index}`}
                    value={question[`type_${index}`]}
                    required={true}
                />
            </Grid>
            {/* 2nd row filter columns */}
            {
                (index === 0 && question.category === 'Academic') && (
                    <>
                        <Grid size={4}>
                            <CustomLabel fieldName="Division" />
                            <CustomAutoComplete
                                options={divisions}
                                name={`division`}
                                value={question[`division`]}
                                handleInput={handleInput}
                                required={true}
                            />
                        </Grid>
                        <Grid size={4}>
                            <CustomLabel fieldName="Subject" />
                            <CustomAutoComplete
                                options={subjects}
                                name={`subject`}
                                value={question[`subject`]}
                                handleInput={handleInput}
                                required={true}
                            />
                        </Grid>
                        <Grid size={4}>
                            <CustomLabel fieldName="Chapter" />
                            <CustomAutoComplete
                                options={chapters}
                                name={`chapter`}
                                value={question[`chapter`]}
                                handleInput={handleInput}
                                required={true}
                            />
                        </Grid>
                    </>)
            }
            {/* in case of admission */}
            {
                (index === 0 && question.category === 'Admission') && (
                    <>
                        <Grid size={4}>
                            <CustomLabel fieldName="University Type" />
                            <CustomAutoComplete
                                options={universityTypes}
                                name={`universityType`}
                                value={question[`universityType`]}
                                handleInput={handleInput}
                                required={true}
                            />
                        </Grid>
                        <Grid size={4}>
                            <CustomLabel fieldName="University Name" />
                            <CustomAutoComplete
                                options={universityNames}
                                name={`universityName`}
                                value={question[`universityName`]}
                                handleInput={handleInput}
                                required={true}
                            />
                        </Grid>
                        {question.universityType === 'University' && (
                            <Grid size={4}>
                                <CustomLabel fieldName="Unit" />
                                <CustomAutoComplete
                                    options={units}
                                    name={`unit`}
                                    value={question[`unit`]}
                                    handleInput={handleInput}
                                    required={true}
                                />
                            </Grid>
                        )}

                        <Grid size={4}>
                            <CustomLabel fieldName="Subject" />
                            <CustomAutoComplete
                                options={subjects}
                                name={`subject`}
                                value={question[`subject`]}
                                handleInput={handleInput}
                                required={true}
                            />
                        </Grid>
                    </>)
            }

            {/* in case of job */}
            {
                (index === 0 && question.category === 'Job') && (
                    <>
                        <Grid size={4}>
                            <CustomLabel fieldName="Job Type" />
                            <CustomAutoComplete
                                options={jobTypes}
                                name={`jobType`}
                                value={question[`jobType`]}
                                handleInput={handleInput}
                                required={true}
                            />
                        </Grid>
                        <Grid size={4}>
                            <CustomLabel fieldName="Job Name" />
                            <CustomAutoComplete
                                options={jobNames}
                                name={`jobName`}
                                value={question[`jobName`]}
                                handleInput={handleInput}
                                required={true}
                            />
                        </Grid>
                        <Grid size={4}>
                            <CustomLabel fieldName="Subject" />
                            <CustomAutoComplete
                                options={subjects}
                                name={`subject`}
                                value={question[`subject`]}
                                handleInput={handleInput}
                                required={true}
                            />
                        </Grid>
                    </>)
            }

            {/* question title input field */}
            <Grid size={12}>
                <CustomLabel fieldName='Question' />
                <AdornedTextField
                    name={`title_${index}`}
                    handleInput={handleInput}
                    handleFileIconClick={handleFileIconClick}
                    placeholder='Write your question here'
                    fileInputRef={fileInputRef}
                    required={true}
                    handleFileInput={handleFileInput}
                    value={question[`title_${index}`]}
                />
                {
                    imageFile[`${index}`] &&
                    (
                        <Grid size={12} sx={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>

                            <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: "500", mt: 0.5, bgcolor: teal[50], px: 1, py: 0.5, borderRadius: 2 }} color={teal[500]}>
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

            </Grid>
            {/* mcq row */}
            {

                (question[`type_${index}`] === 'MCQ' || '') && (
                    <>
                        {Array.from(Array(4)).map((item, optionIndex) => (
                            <Grid size={3}>
                                <CustomLabel fieldName={`Option ${optionIndex + 1}`} />
                                <CustomTextField
                                    name={`option${optionIndex + 1}_${index}`}
                                    value={question[`option${optionIndex + 1}_${index}`]}
                                    handleInput={handleInput}
                                    placeholder={`Option ${optionIndex + 1}`}
                                    required={true}
                                />
                            </Grid>
                        ))}
                        < Grid size={12}>
                            <CustomLabel fieldName='Correct Answer' />
                            <CustomTextField
                                name={`correctOption_${index}`}
                                value={question[`correctOption_${index}`]}
                                handleInput={handleInput}
                                placeholder='Write the correct answer'
                                required={true}
                            />
                        </ Grid>
                    </>
                )
            }
            {/* mcq row ends */}
            {/* question description */}
            <Grid size={12}>
                <CustomLabel fieldName='Answer Description' />
                <CustomTextField
                    name={`description_${index}`}
                    value={question[`description_${index}`]}
                    handleInput={handleInput}
                    placeholder="Explain the answer here"
                    multiline={true}
                    rows={4}
                    required={true} />
            </Grid>
        </>
    );
};

export default AddQuestionForm;