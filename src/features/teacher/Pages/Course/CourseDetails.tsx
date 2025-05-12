import { Box, Button, Card, Paper, styled, Snackbar, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import CustomLabel from "../../../../shared/components/CustomLabel";
import CustomTextField from "../../../../shared/components/CustomTextField";
import CustomAutoComplete from "../../../../shared/components/CustomAutoComplete";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { forwardRef, useImperativeHandle, useState } from "react";
import { useAppDispatch } from "../../../../redux/hooks";
import { useGetAllCategoryTypesQuery } from "../../../../redux/features/category/categoryApi";
import Loader from "../../../../shared/components/Loader";
import { saveCourseIdToStore } from "../../../../redux/features/course/courseSlice";
import { useGetCategoryForCourseQuery, useSaveCourseMutation } from "../../../../redux/features/course/courseApi";
import { useGetUnitsQuery, useGetJobTypesQuery, useGetJobNamesQuery } from "../../../../redux/features/category/categoryApi";
import { useNavigate } from "react-router-dom";
import { getUniqueStrings } from "../../../../utils/typeSafeUniqueArrays";
import Alert from '@mui/material/Alert';

type CourseDetailsProps = {
    setActiveSteps?: React.Dispatch<React.SetStateAction<number>>;
};
// to hide the default input field for file upload
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});
const CourseDetails = forwardRef<{ submitForm: () => void; }, CourseDetailsProps>(({ setActiveSteps }, ref) => {
    // below state stores the selected image url
    const [tempCover, setTempCover] = useState('');
    // below state handles the selected image file and ready it to upload
    const [coverImg, setCoverUmg] = useState<File | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string[]; }>({});
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);


    // react router hook
    const navigate = useNavigate();

    const [courseDetails, setCourseDetails] = useState({
        name: "",
        details: "",
        // isPending: true,
        // isPublished: false,
        // teacher_id: "",
    });

    // category params state
    const [categoryParams, setCategoryParams] = useState({
        category: '',
        division: '',
        subject: '',
        chapter: '',
        universityName: '',
        universityType: '',
        unit: '', // new field for Admission category
        jobType: '', // new field for Job category
        jobName: '', // new field for Job category
    });

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
    // calling the create course method from redux
    const [saveCourse, { isSuccess, isLoading: creationLoader }] = useSaveCourseMutation();

    // setting the data to local redux store
    const dispatch = useAppDispatch();

    // calling the imperative handle to execute submit handler from the parent component
    useImperativeHandle(ref, () => ({
        submitForm: () => {
            handleSubmit();
        },
    }));

    // when calling the mutation api
    if (isLoading || categoryLoading || creationLoader || unitsLoading || jobTypesLoading || jobNamesLoading) {
        return <Loader />;
    }

    // extracting divisions subjects, chapter, universityType, universityName, from the category data and creating unique array. The getUniqueStrings is a custom function helping to provide type safety.
    const divisions = getUniqueStrings(categoryData?.data || [], 'division');
    const subjects = getUniqueStrings(categoryData?.data || [], 'subject');
    const chapters = getUniqueStrings(categoryData?.data || [], 'chapter');
    const universityNames = getUniqueStrings(categoryData?.data || [], 'universityName');
    const universityTypes = getUniqueStrings(categoryData?.data || [], 'universityType');
    const units = getUniqueStrings(unitsData?.data || [], 'unit');
    const jobTypes = getUniqueStrings(jobTypesData?.data || [], 'jobType');
    const jobNames = getUniqueStrings(jobNamesData?.data || [], 'jobName');

    const categoryId = categoryData?.data[0]?._id;
    console.log('filtered category id', categoryId);

    //^handling the cover image change
    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setTempCover(URL.createObjectURL(file));
            // Store the file separately for the form submission
            setCoverUmg(file);
            // Clear validation error if exists
            if (errors.coverImage) {
                setErrors((prev) => ({ ...prev, coverImage: [] }));
            }

        }
    };

    //^ handling non file form data
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCourseDetails((prevState) => ({ ...prevState, [name]: value }));
        // Clear validation error if exists
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: [] }));
        }
    };

    const handleCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCategoryParams((prevState) => ({ ...prevState, [name]: value }));
        // Clear validation error if exists
        if (errors[e.target.name]) {
            setErrors((prev) => ({ ...prev, [e.target.name]: [] }));
        }

    };


    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();

        // error handling start
        const validationErrors: { [key: string]: string[]; } = {};
        const snackbarMessages: string[] = [];

        // Validate category
        if (!categoryParams.category) {
            validationErrors.category = ['Course category is required'];
            snackbarMessages.push('Course category is required');
        }

        // Validate cover image
        if (!coverImg) {
            validationErrors.coverImage = ['Cover image is required'];
            snackbarMessages.push('Cover image is required');
        }

        // If validation errors exist, stop submission
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setErrorMessages(snackbarMessages);
            setOpenErrorSnackbar(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // error handling end
        const courseData = new FormData();
        if (coverImg) courseData.append('coverImage', coverImg);

        const updatedCourseDetails = {
            ...courseDetails,
            category_id: categoryId
        };
        courseData.append('courseData', JSON.stringify(updatedCourseDetails));

        // Reset previous errors
        setErrors({});

        const result = await saveCourse(courseData);

        if ('error' in result) {
            const errorSources =
                'data' in result.error && typeof result.error.data === 'object' && result.error.data !== null
                    ? (result.error.data as { errorSources?: { path: string; message: string; }[]; }).errorSources
                    : undefined;
            if (errorSources && Array.isArray(errorSources)) {
                const errorMap: { [key: string]: string[]; } = {};
                const allMessages: string[] = [];
                errorSources.forEach((source: { path: string, message: string; }) => {
                    if (!errorMap[source.path]) {
                        errorMap[source.path] = [];
                    }
                    errorMap[source.path].push(source.message);
                    allMessages.push(source.message); // collect for Snackbar
                });
                setErrors(errorMap);
                setErrorMessages(allMessages);
                setOpenErrorSnackbar(true);
                // scroll to the top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            return;
        }

        const course_id = result?.data?.data?._id;
        dispatch(saveCourseIdToStore({ course_id }));
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
        setCourseDetails({
            name: "",
            details: "",
        });
        navigate('/teacher/create-course/create-lessons');
        setActiveSteps?.(prevStep => prevStep + 1);
    };

    console.log('All Category Params:', categoryQueryParams);
    console.log('Filtered category id:', categoryId);

    return (
        <>
            <Box sx={{ width: '100%', height: 'auto' }}>
                <Paper variant="outlined" sx={{ width: '100%', height: 'auto', borderRadius: '10px', p: 3 }}>
                    <form encType="multipart/form-data" onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            {/* course name field */}
                            <Grid size={6}>
                                <CustomLabel fieldName="Course Name*" />
                                <CustomTextField
                                    name="name"
                                    handleInput={handleInput}
                                    value={courseDetails.name}
                                    error={!!errors.name?.length}
                                    helperText={errors.name?.join(' ')}
                                    required
                                />
                            </Grid>
                            {/* course category field */}
                            <Grid size={6}>
                                <CustomLabel fieldName="Course Category*" />
                                <CustomAutoComplete
                                    name='category'
                                    options={categoryTypes?.data || []}
                                    value={categoryParams.category}
                                    handleInput={handleCategory}
                                    error={!!errors.category}
                                    helperText={errors.category?.join(' ')}
                                />
                            </Grid>
                            {/* 2nd row filter columns */}
                            {
                                (categoryParams.category === 'Academic') && (
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
                                        <Grid size={4}>
                                            <CustomLabel fieldName="Subject*" />
                                            <CustomAutoComplete
                                                options={subjects || []}
                                                name={`subject`}
                                                handleInput={handleCategory}
                                                value={categoryParams.subject}
                                                required={true} />
                                        </Grid>
                                        <Grid size={4}>
                                            <CustomLabel fieldName="Chapter*" />
                                            <CustomAutoComplete
                                                options={chapters || []}
                                                name={`chapter`}
                                                handleInput={handleCategory}
                                                required={true}
                                                value={categoryParams.chapter}
                                            />
                                        </Grid>
                                    </>)
                            }
                            {/* in case of admission */}
                            {
                                (categoryParams.category === 'Admission') && (
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
                                        <Grid size={4}>
                                            <CustomLabel fieldName="Subject*" />
                                            <CustomAutoComplete
                                                options={subjects || []}
                                                name={`subject`}
                                                handleInput={handleCategory}
                                                required={true}
                                                value={categoryParams.subject}
                                            />
                                        </Grid>

                                    </>)
                            }
                            {/* in case of job */}
                            {
                                (categoryParams.category === 'Job') && (
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
                                        <Grid size={4}>
                                            <CustomLabel fieldName="Subject*" />
                                            <CustomAutoComplete
                                                options={subjects || []}
                                                name={`subject`}
                                                handleInput={handleCategory}
                                                required={true}
                                                value={categoryParams.subject}
                                            />
                                        </Grid>
                                    </>)
                            }
                            {/* cover image upload button */}
                            <Grid size={12}>
                                <CustomLabel fieldName="Upload Cover Image*" />
                                <Card variant="outlined"
                                    sx={{ position: 'relative', height: '240px', mt: 0.8, px: 1.5, py: 0.8, borderRadius: 2 }}
                                >
                                    <Box>
                                        <img alt="cover-photo"
                                            src={tempCover || ''}
                                            style={{ width: "100%", height: "100%", objectFit: 'cover', display: tempCover === '' ? 'none' : 'block' }}
                                        />
                                        {/* new image upload button */}
                                        <Button component="label"
                                            size="small"
                                            variant="text"
                                            tabIndex={-1}
                                            startIcon={<CloudUploadIcon />}
                                            sx={{ position: 'absolute', top: "45%", left: '43%', color: "gray.700", borderRadius: "8px", cursor: "pointer", backgroundColor: tempCover ? "white" : 'transparent' }}
                                        >

                                            {tempCover ? 'Change Cover Image' : 'Click to Upload'}
                                            <VisuallyHiddenInput
                                                type="file"
                                                onChange={handleCoverChange}
                                            />
                                        </Button>
                                    </Box>
                                </Card>
                                {/* for showing error message */}
                                {errors.coverImage && (
                                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                        {errors.coverImage.join(' ')}
                                    </Typography>
                                )}

                            </Grid>
                            {/* course details */}
                            <Grid size={12}>
                                <CustomLabel fieldName="Course Details*" />
                                <CustomTextField
                                    name="details"
                                    multiline={true}
                                    rows={6}
                                    handleInput={handleInput}
                                    value={courseDetails.details}
                                    error={!!errors.details?.length}
                                    helperText={errors.details?.join(' ')}
                                />
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Box>
            {/* showing alert for what happened after submitting the request */}
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
});

export default CourseDetails;