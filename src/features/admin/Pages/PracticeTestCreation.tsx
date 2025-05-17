import { Box, Button, Paper, Typography, Snackbar, IconButton } from "@mui/material";
import Grid from '@mui/material/Grid2';
import CustomLabel from "../../../shared/components/CustomLabel";
import CustomTextField from "../../../shared/components/CustomTextField";
import CustomAutoComplete from "../../../shared/components/CustomAutoComplete";
import { useState } from "react";
import { useAppDispatch } from "../../../redux/hooks";
import {
    useGetAllCategoryTypesQuery,
    useGetUnitsQuery,
    useGetJobTypesQuery,
    useGetJobNamesQuery,
    useCreateCategoryMutation
} from "../../../redux/features/category/categoryApi";
import Loader from "../../../shared/components/Loader";
import { useGetCategoryForCourseQuery } from "../../../redux/features/course/courseApi";
import { getUniqueStrings } from "../../../utils/typeSafeUniqueArrays";
import Alert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {useCreateQuestionPatternMutation} from "../../../redux/features/questionPatternApi.ts";

const PracticeTestCreation = () => {
    const [errors, setErrors] = useState<{ [key: string]: string[]; }>({});
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    // test parameters state - time and questionType now
    const [testDetails, setTestDetails] = useState({
        time: "",
        questionType: "MCQ", // Default question type for the entire test
    });

    // category params state
    const [categoryParams, setCategoryParams] = useState({
        category: '',
        division: '',
        subject: '',
        chapter: '',
        universityName: '',
        universityType: '',
        unit: '',
        jobType: '',
        jobName: '',
    });

    // subject sections - removed questionType as it's now at the test level
    const [subjectSections, setSubjectSections] = useState([
        {
            subject: '',
            questionCount: '25',
            subjectCategory: 'Main Subject',
        }
    ]);

    // creating a query parameter object
    const categoryQueryParams = {
        ...(categoryParams.category && { category: categoryParams.category }),
        ...(categoryParams.division && { division: categoryParams.division }),
        ...(categoryParams.subject && { subject: categoryParams.subject }),
        ...(categoryParams.chapter && { chapter: categoryParams.chapter }),
        ...(categoryParams.universityName && { universityName: categoryParams.universityName }),
        ...(categoryParams.universityType && { universityType: categoryParams.universityType }),
        ...(categoryParams.unit && { unit: categoryParams.unit }),
        ...(categoryParams.jobType && { jobType: categoryParams.jobType }),
        ...(categoryParams.jobName && { jobName: categoryParams.jobName }),
    };

    // fetching all the categories from an api call
    const { data: categoryTypes, isLoading } = useGetAllCategoryTypesQuery({});
    // redux api call for fetching all the categories
    const { data: categoryData, isLoading: categoryLoading } = useGetCategoryForCourseQuery(categoryQueryParams);
    // fetching units, job types and job names
    const { data: unitsData, isLoading: unitsLoading } = useGetUnitsQuery({});
    const { data: jobTypesData, isLoading: jobTypesLoading } = useGetJobTypesQuery({});
    const { data: jobNamesData, isLoading: jobNamesLoading } = useGetJobNamesQuery({});
    // calling the create category method from redux
    const [createCategory, { isLoading: creationLoader }] = useCreateCategoryMutation();
    const [createQuestionPattern, { isLoading: creationQuestionPatternLoader }] = useCreateQuestionPatternMutation();


    // setting the data to local redux store
    const dispatch = useAppDispatch();

    // when calling the api
    if (isLoading || categoryLoading || creationLoader || unitsLoading || jobTypesLoading || jobNamesLoading) {
        return <Loader />;
    }

    // extracting divisions subjects, chapter, universityType, universityName, from the category data and creating unique array.
    const divisions = getUniqueStrings(categoryData?.data || [], 'division');
    const subjects = getUniqueStrings(categoryData?.data || [], 'subject');
    const chapters = getUniqueStrings(categoryData?.data || [], 'chapter');
    const universityNames = getUniqueStrings(categoryData?.data || [], 'universityName');
    const universityTypes = getUniqueStrings(categoryData?.data || [], 'universityType');
    const units = getUniqueStrings(unitsData?.data || [], 'unit');
    const jobTypes = getUniqueStrings(jobTypesData?.data || [], 'jobType');
    const jobNames = getUniqueStrings(jobNamesData?.data || [], 'jobName');

    // Get all category IDs from the categoryData
    const categoryIds = categoryData?.data?.map(category => category._id) || [];

    // handling input for test details
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTestDetails((prevState) => ({ ...prevState, [name]: value }));
        // Clear validation error if exists
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: [] }));
        }
    };

    // handling category input
    const handleCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Create updated state
        const updatedCategoryParams = {
            ...categoryParams,
            [name]: value
        };

        // Clear dependent fields when parent field changes
        if (name === 'category') {
            // Reset all dependent fields when category changes
            updatedCategoryParams.division = '';
            updatedCategoryParams.subject = '';
            updatedCategoryParams.chapter = '';
            updatedCategoryParams.universityName = '';
            updatedCategoryParams.universityType = '';
            updatedCategoryParams.unit = '';
            updatedCategoryParams.jobType = '';
            updatedCategoryParams.jobName = '';
        } else if (name === 'division') {
            // Reset subject and chapter when division changes
            updatedCategoryParams.subject = '';
            updatedCategoryParams.chapter = '';
        } else if (name === 'subject') {
            // Reset chapter when subject changes
            updatedCategoryParams.chapter = '';
        } else if (name === 'universityType') {
            // Reset universityName and unit when universityType changes
            updatedCategoryParams.universityName = '';
            updatedCategoryParams.unit = '';
        } else if (name === 'jobType') {
            // Reset jobName when jobType changes
            updatedCategoryParams.jobName = '';
        }

        // Update state with the new values
        setCategoryParams(updatedCategoryParams);

        // Clear validation error if exists
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: [] }));
        }
    };

    // handling subject section inputs - updated for new structure
    const handleSubjectSectionInput = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedSections = [...subjectSections];

        // Map field names if needed
        const fieldName = name === 'totalQuestions' ? 'questionCount' : name;

        updatedSections[index] = { ...updatedSections[index], [fieldName]: value };
        setSubjectSections(updatedSections);
    };

    // add subject section
    const addSubjectSection = () => {
        setSubjectSections([
            ...subjectSections,
            {
                subject: '',
                questionCount: '25',
                subjectCategory: 'Main Subject',
            }
        ]);
    };

    // remove subject section
    const removeSubjectSection = (index: number) => {
        if (subjectSections.length > 1) {
            const updatedSections = [...subjectSections];
            updatedSections.splice(index, 1);
            setSubjectSections(updatedSections);
        }
    };

    // submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // error handling start
        const validationErrors: { [key: string]: string[]; } = {};
        const snackbarMessages: string[] = [];

        // Validate category
        if (!categoryParams.category) {
            validationErrors.category = ['Test category is required'];
            snackbarMessages.push('Test category is required');
        }

        // Validate time
        if (!testDetails.time) {
            validationErrors.time = ['Test duration is required'];
            snackbarMessages.push('Test duration is required');
        }

        // If validation errors exist, stop submission
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setErrorMessages(snackbarMessages);
            setOpenErrorSnackbar(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // Separate main subjects and optional subjects - without questionType
        const mainSubjects = subjectSections
            .filter(section => section.subjectCategory === 'Main Subject')
            .map(({ subject, questionCount }) => ({
                subject,
                questionCount: parseInt(questionCount)
            }));

        const optionalSubjects = subjectSections
            .filter(section => section.subjectCategory === 'Sub Subject')
            .map(({ subject, questionCount }) => ({
                subject,
                questionCount: parseInt(questionCount)
            }));

        // Prepare test data with the updated structure
        const testData = {
            category_id: categoryIds, // Use all category IDs
            time: parseInt(testDetails.time),
            questionType: testDetails.questionType, // Single questionType at the top level
            mainSubjects,
            optionalSubjects
        };

        // Reset previous errors
        setErrors({});

        try {
            // Here you would submit the test data to your API
            const result = await createQuestionPattern(testData);
            console.log('Test data submitted:', testData);
            console.log('Test data result:', result);

            // Reset form after successful submission
            setTestDetails({
                time: "",
                questionType: "MCQ",
            });
            setCategoryParams({
                category: '',
                division: '',
                subject: '',
                chapter: '',
                universityName: '',
                universityType: '',
                unit: '',
                jobType: '',
                jobName: '',
            });
            setSubjectSections([
                {
                    subject: '',
                    questionCount: '25',
                    subjectCategory: 'Main Subject',
                }
            ]);
        } catch (error) {
            // Handle error
            console.error('Error creating test:', error);
            setErrorMessages(['Failed to create test. Please try again.']);
            setOpenErrorSnackbar(true);
        }
    };

    return (
        <>
            <Box component='section' sx={{ mt: 3 }}>
                <Typography variant="h5" sx={{ mb: 3 }}>Set New Test</Typography>
                <Box sx={{ width: '100%', height: 'auto' }}>
                    <Paper variant="outlined" sx={{ width: '100%', height: 'auto', borderRadius: '10px', p: 3 }}>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                {/* Test category field */}
                                <Grid size={6}>
                                    <CustomLabel fieldName="Test Category*" />
                                    <CustomAutoComplete
                                        name='category'
                                        options={categoryTypes?.data || []}
                                        value={categoryParams.category}
                                        handleInput={handleCategory}
                                        error={!!errors.category}
                                        helperText={errors.category?.join(' ')}
                                    />
                                </Grid>

                                {/* Dynamic fields based on category selection */}
                                {(categoryParams.category === 'Academic') && (
                                    <>
                                        <Grid size={4}>
                                            <CustomLabel fieldName="Division*" />
                                            <CustomAutoComplete
                                                options={divisions || []}
                                                name={`division`}
                                                handleInput={handleCategory}
                                                required={true}
                                                value={categoryParams.division}
                                            />
                                        </Grid>
                                    </>
                                )}

                                {/* In case of admission */}
                                {(categoryParams.category === 'Admission') && (
                                    <>
                                        <Grid size={4}>
                                            <CustomLabel fieldName="University Type*" />
                                            <CustomAutoComplete
                                                options={universityTypes || []}
                                                name={`universityType`}
                                                handleInput={handleCategory}
                                                required={true}
                                                value={categoryParams.universityType}
                                            />
                                        </Grid>
                                        <Grid size={4}>
                                            <CustomLabel fieldName="University Name*" />
                                            <CustomAutoComplete
                                                options={universityNames || []}
                                                name={`universityName`}
                                                handleInput={handleCategory}
                                                required={true}
                                                value={categoryParams.universityName}
                                            />
                                        </Grid>
                                        {categoryParams.universityType === 'University' && (
                                            <Grid size={4}>
                                                <CustomLabel fieldName="Unit*" />
                                                <CustomAutoComplete
                                                    options={units || []}
                                                    name="unit"
                                                    handleInput={handleCategory}
                                                    required={true}
                                                    value={categoryParams.unit}
                                                    error={!!errors.unit?.length}
                                                    helperText={errors.unit?.join(' ')}
                                                />
                                            </Grid>
                                        )}
                                    </>
                                )}

                                {/* In case of job */}
                                {(categoryParams.category === 'Job') && (
                                    <>
                                        <Grid size={4}>
                                            <CustomLabel fieldName="Job Type*" />
                                            <CustomAutoComplete
                                                options={jobTypes || []}
                                                name="jobType"
                                                handleInput={handleCategory}
                                                required={true}
                                                value={categoryParams.jobType}
                                                error={!!errors.jobType?.length}
                                                helperText={errors.jobType?.join(' ')}
                                            />
                                        </Grid>
                                        <Grid size={4}>
                                            <CustomLabel fieldName="Job Name*" />
                                            <CustomAutoComplete
                                                options={jobNames || []}
                                                name="jobName"
                                                handleInput={handleCategory}
                                                required={true}
                                                value={categoryParams.jobName}
                                                error={!!errors.jobName?.length}
                                                helperText={errors.jobName?.join(' ')}
                                            />
                                        </Grid>
                                    </>
                                )}

                                {/* Time field */}
                                <Grid size={6}>
                                    <CustomLabel fieldName="Test Duration (in minutes)*" />
                                    <CustomTextField
                                        name="time"
                                        type="number"
                                        handleInput={handleInput}
                                        value={testDetails.time || ""}
                                        error={!!errors.time?.length}
                                        helperText={errors.time?.join(' ')}
                                        required
                                    />
                                </Grid>

                                {/* Question Type field - moved to test level */}
                                <Grid size={6}>
                                    <CustomLabel fieldName="Question Type*" />
                                    <CustomAutoComplete
                                        options={['MCQ', 'Written']}
                                        name="questionType"
                                        handleInput={handleInput}
                                        required={true}
                                        value={testDetails.questionType}
                                    />
                                </Grid>

                                {/* Subject Sections */}
                                <Grid size={12}>
                                    <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>Test List</Typography>

                                    {subjectSections.map((section, index) => (
                                        <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                                            <Grid container spacing={2}>
                                                <Grid size={4}>
                                                    <CustomLabel fieldName="Subject*" />
                                                    <CustomAutoComplete
                                                        options={subjects || []}
                                                        name="subject"
                                                        handleInput={(e) => handleSubjectSectionInput(index, e)}
                                                        required={true}
                                                        value={section.subject}
                                                    />
                                                </Grid>
                                                <Grid size={4}>
                                                    <CustomLabel fieldName="Total Questions*" />
                                                    <CustomAutoComplete
                                                        options={['5', '10', '15', '20', '25', '30']}
                                                        name="totalQuestions"
                                                        handleInput={(e) => handleSubjectSectionInput(index, e)}
                                                        required={true}
                                                        value={section.questionCount}
                                                    />
                                                </Grid>
                                                <Grid size={4}>
                                                    <CustomLabel fieldName="Subject Category*" />
                                                    <CustomAutoComplete
                                                        options={['Main Subject', 'Sub Subject']}
                                                        name="subjectCategory"
                                                        handleInput={(e) => handleSubjectSectionInput(index, e)}
                                                        required={true}
                                                        value={section.subjectCategory}
                                                    />
                                                </Grid>
                                                {subjectSections.length > 1 && (
                                                    <Grid size={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => removeSubjectSection(index)}
                                                            sx={{ mt: 1 }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </Box>
                                    ))}

                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={addSubjectSection}
                                        sx={{ mt: 2 }}
                                    >
                                        Add Subject
                                    </Button>
                                </Grid>

                                {/* Submit button */}
                                <Grid size={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                    <Button variant="contained" type="submit">
                                        Save Test
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Box>
            </Box>

            {/* Error Snackbar */}
            <Snackbar
                open={openErrorSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenErrorSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity="error"
                    onClose={() => setOpenErrorSnackbar(false)}
                    sx={{ width: '100%' }}
                >
                    {errorMessages.map((msg, i) => (
                        <div key={i}>{msg}</div>
                    ))}
                </Alert>
            </Snackbar>
        </>
    );
};

export default PracticeTestCreation;