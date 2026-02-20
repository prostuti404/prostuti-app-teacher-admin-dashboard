import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Paper,
    Typography,
    Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomTextField from '../../../shared/components/CustomTextField';
import { useGetQuestionPatternByIdQuery, useDeleteQuestionPatternMutation } from '../../../redux/features/practiceTestApi';
import Loader from '../../../shared/components/Loader';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { getErrorMessage } from '../../../utils/getErrorMessage';

const SingleQuestionPattern = () => {
    const { qpId } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, isError } = useGetQuestionPatternByIdQuery(qpId || '');
    const [deleteQuestionPattern, { isLoading: isDeleting }] = useDeleteQuestionPatternMutation();
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleDelete = async () => {
        try {
            await deleteQuestionPattern(qpId!).unwrap();
            setSnackbar({ open: true, message: 'Question pattern deleted successfully', severity: 'success' });
            setTimeout(() => navigate('/admin/practice-test'), 1500);
        } catch (error) {
            setSnackbar({ open: true, message: getErrorMessage(error, 'Failed to delete question pattern'), severity: 'error' });
        }
    };

    if (isLoading) return <Loader />;
    if (isError || !data?.data) return <Typography sx={{ p: 2 }}>Failed to load data</Typography>;

    const pattern = data.data;
    const {
        category_id,
        time,
        questionType,
        mcqCount,
        writtenCount,
        mainSubjects,
        optionalSubjects,
    } = pattern;

    const firstCat = category_id?.[0] || {};

    const renderSubjectSection = (subjects: any[], label: string) => (
        <>
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>{label}</Typography>
            {subjects.map((section, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 4 }} >
                            <Typography>Subject</Typography>
                            <CustomTextField
                                name={`subject-${index}`}
                                value={section.subject}
                                disabled
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Typography>Total Questions</Typography>
                            <CustomTextField
                                name={`questionCount-${index}`}
                                value={section.questionCount.toString()}
                                disabled
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Typography>Subject Category</Typography>
                            <CustomTextField
                                name={`category-${index}`}
                                value={label}
                                disabled
                            />
                        </Grid>
                    </Grid>
                </Box>
            ))}
        </>
    );

    return (
        <Box sx={{ p: 3 }}>
            {/* Header Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Button variant="outlined" onClick={() => navigate(-1)} startIcon={<ArrowBackIcon />} sx={{ mr: 2 }}>
                        Back
                    </Button>
                    <Typography variant="h4" sx={{ fontWeight: "bold", color: "#3F3F46" }}>Test Overview</Typography>
                </Box>
                {/* delete button */}
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
            </Box>

            {/* test details section */}

            <Paper variant="outlined" sx={{ borderRadius: 2, p: 3 }}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography>Test Category</Typography>
                        <CustomTextField
                            name="type"
                            value={firstCat?.type || 'N/A'}
                            disabled
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography>Division</Typography>
                        <CustomTextField
                            name="division"
                            value={firstCat?.division || 'N/A'}
                            disabled
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography>Test Duration (in minutes)</Typography>
                        <CustomTextField
                            name="time"
                            value={time?.toString() || ''}
                            disabled
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography>Question Type</Typography>
                        <CustomTextField
                            name="questionType"
                            value={questionType || ''}
                            disabled
                        />
                    </Grid>
                    {questionType === 'Hybrid' && (
                        <>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography>MCQ Count</Typography>
                                <CustomTextField
                                    name="mcqCount"
                                    value={mcqCount?.toString() || '0'}
                                    disabled
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography>Written Count</Typography>
                                <CustomTextField
                                    name="writtenCount"
                                    value={writtenCount?.toString() || '0'}
                                    disabled
                                />
                            </Grid>
                        </>
                    )}
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Subjects */}
                {renderSubjectSection(mainSubjects, 'Main Subject')}
                {optionalSubjects.length > 0 && renderSubjectSection(optionalSubjects, 'Sub Subject')}
            </Paper>
        </Box>
    );
};

export default SingleQuestionPattern;