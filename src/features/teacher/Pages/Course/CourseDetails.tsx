import { Box, Button, Card, Paper, styled, Snackbar, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import CustomLabel from "../../../../shared/components/CustomLabel";
import CustomTextField from "../../../../shared/components/CustomTextField";
import CustomAutoComplete from "../../../../shared/components/CustomAutoComplete";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { forwardRef, useImperativeHandle, useState } from "react";
import { useAppDispatch } from "../../../../redux/hooks";
import Loader from "../../../../shared/components/Loader";
import { saveCourseIdToStore } from "../../../../redux/features/course/courseSlice";
import { useSaveCourseMutation } from "../../../../redux/features/course/courseApi";
import { useGetAllCategoriesQuery } from "../../../../redux/features/category/categoryApi";
import { useNavigate } from "react-router-dom";
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
    });

    // cascading category state
    const [categoryState, setCategoryState] = useState({
        group: '',
        type: '',
        name: '',
    });

    // fetch all categories
    const { data: allCategoriesData, isLoading: categoryLoading } = useGetAllCategoriesQuery({ limit: 0 });
    const categories = allCategoriesData?.data || [];

    // compute dropdown options
    interface ICategory { group: string; type: string; name: string; _id: string; }
    const uniqueGroups = Array.from(new Set(categories.map((c: ICategory) => c.group)));
    const availableTypes = Array.from(new Set(categories.filter((c: ICategory) => c.group === categoryState.group).map((c: ICategory) => c.type)));
    const availableNames = Array.from(new Set(categories.filter((c: ICategory) => c.group === categoryState.group && c.type === categoryState.type).map((c: ICategory) => c.name)));

    const selectedCategory = categories.find((c: ICategory) => c.group === categoryState.group && c.type === categoryState.type && c.name === categoryState.name);

    // calling the create course method from redux
    const [saveCourse, { isLoading: creationLoader }] = useSaveCourseMutation();
    const dispatch = useAppDispatch();

    // calling the imperative handle to execute submit handler from the parent component
    useImperativeHandle(ref, () => ({
        submitForm: () => {
            handleSubmit();
        },
    }));

    if (categoryLoading || creationLoader) {
        return <Loader />;
    }

    // handling the cover image change
    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setTempCover(URL.createObjectURL(file));
            setCoverUmg(file);
            if (errors.coverImage) {
                setErrors((prev) => ({ ...prev, coverImage: [] }));
            }
        }
    };

    // handling non file form data
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCourseDetails((prevState) => ({ ...prevState, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: [] }));
        }
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        const newState = { ...categoryState, [name]: value };
        if (name === 'group') {
            newState.type = '';
            newState.name = '';
        } else if (name === 'type') {
            newState.name = '';
        }
        
        setCategoryState(newState);

        if (errors.category) {
            setErrors((prev) => ({ ...prev, category: [] }));
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();

        const validationErrors: { [key: string]: string[]; } = {};
        const snackbarMessages: string[] = [];

        if (!selectedCategory?._id) {
            validationErrors.category = ['Please select a complete category (Group, Type, Name)'];
            snackbarMessages.push('Please select a complete category');
        }

        if (!coverImg) {
            validationErrors.coverImage = ['Cover image is required'];
            snackbarMessages.push('Cover image is required');
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setErrorMessages(snackbarMessages);
            setOpenErrorSnackbar(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const courseData = new FormData();
        if (coverImg) courseData.append('coverImage', coverImg);

        const updatedCourseDetails = {
            ...courseDetails,
            category_id: selectedCategory._id
        };
        courseData.append('courseData', JSON.stringify(updatedCourseDetails));

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
                    allMessages.push(source.message);
                });
                setErrors(errorMap);
                setErrorMessages(allMessages);
                setOpenErrorSnackbar(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            return;
        }

        const course_id = result?.data?.data?._id;
        dispatch(saveCourseIdToStore({ course_id }));
        setCategoryState({ group: '', type: '', name: '' });
        setCourseDetails({ name: "", details: "" });
        navigate('/teacher/create-course/create-lessons');
        setActiveSteps?.(prevStep => prevStep + 1);
    };

    return (
        <>
            <Box sx={{ width: '100%', height: 'auto' }}>
                <Paper variant="outlined" sx={{ width: '100%', height: 'auto', borderRadius: '10px', p: 3 }}>
                    <form encType="multipart/form-data" onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            {/* course name field */}
                            <Grid size={12}>
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

                            {/* category fields */}
                            <Grid size={4}>
                                <CustomLabel fieldName="Category Group*" />
                                <CustomAutoComplete
                                    name="group"
                                    options={uniqueGroups as string[]}
                                    value={categoryState.group}
                                    handleInput={handleCategoryChange}
                                    error={!!errors.category}
                                />
                            </Grid>
                            {categoryState.group && (
                                <Grid size={4}>
                                    <CustomLabel fieldName="Category Type*" />
                                    <CustomAutoComplete
                                        name="type"
                                        options={availableTypes as string[]}
                                        value={categoryState.type}
                                        handleInput={handleCategoryChange}
                                        error={!!errors.category}
                                    />
                                </Grid>
                            )}
                            {categoryState.type && (
                                <Grid size={4}>
                                    <CustomLabel fieldName="Category Name*" />
                                    <CustomAutoComplete
                                        name="name"
                                        options={availableNames as string[]}
                                        value={categoryState.name}
                                        handleInput={handleCategoryChange}
                                        error={!!errors.category}
                                        helperText={errors.category?.join(' ')}
                                    />
                                </Grid>
                            )}

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