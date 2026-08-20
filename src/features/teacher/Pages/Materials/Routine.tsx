import { useState, useEffect } from "react";
import { Box, Button, Chip, Paper, Snackbar, Alert, TextField, MenuItem, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PublishIcon from '@mui/icons-material/Publish';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import AddIcon from '@mui/icons-material/Add';
import { Link } from "react-router-dom";
import { useGetCoursePreviewQuery } from "../../../../redux/features/course/courseApi";
import { useGetAllRoutinesQuery, usePublishRoutineMutation, useCreateRoutineMutation } from "../../../../redux/features/materials/materialsApi";
import { useAppSelector } from "../../../../redux/hooks";
import Loader from "../../../../shared/components/Loader";
import { RootState } from "../../../../redux/store";
import { TUser } from "../../../../types/types";

const Routine = () => {
    const user = useAppSelector((state: RootState) => state.auth.user as TUser);
    const courseId = useAppSelector((state) => state.courseAndLessonId.id.course_id);
    const { data: courseData, isLoading } = useGetCoursePreviewQuery({ courseId });

    // Routine API hooks
    const { data: routinesData, isLoading: routinesLoading, refetch: refetchRoutines } = useGetAllRoutinesQuery({ course_id: courseId, limit: 0 });
    const [publishRoutine] = usePublishRoutineMutation();
    const [createRoutine] = useCreateRoutineMutation();

    // Snackbar state
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    // Create routine form state
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newRoutine, setNewRoutine] = useState({ type: 'Class', date: '' });

    // State for handling current month and year
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarData, setCalendarData] = useState([]);
    const [upcomingActivities, setUpcomingActivities] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);

    useEffect(() => {
        if (courseData && courseData.data) {
            processApiData(courseData.data);
        }
    }, [courseData, currentDate]);

    const processApiData = (data) => {
        const activities = [];
        const calendarItems = [];

        // Get the first day of the current month
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

        // Get the last day of the current month
        // const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        // Get the first day of the first week (might be from previous month)
        const startDate = new Date(firstDayOfMonth);
        const dayOfWeek = startDate.getDay();
        startDate.setDate(startDate.getDate() - dayOfWeek);

        // Generate 42 days (6 weeks) to ensure we cover the entire month view
        for (let i = 0; i < 42; i++) {
            const currentDay = new Date(startDate);
            currentDay.setDate(startDate.getDate() + i);

            // If we've gone past the end of the month and completed a week, we can stop
            if (currentDay.getMonth() > currentDate.getMonth() && currentDay.getDay() === 0 && i > 28) {
                break;
            }

            const dayActivities = [];

            // Process all course activities
            data.lessons.forEach(lesson => {
                // Process recorded classes
                lesson.recodedClasses.forEach(recordClass => {
                    const classDate = new Date(recordClass.classDate);
                    if (isSameDay(classDate, currentDay)) {
                        dayActivities.push({
                            type: "Class",
                            details: recordClass.recodeClassName,
                            time: formatTime(classDate)
                        });

                        // Add to upcoming activities if within next 7 days
                        if (isDateUpcoming(classDate)) {
                            activities.push({
                                type: "Class",
                                date: formatDate(classDate),
                                dueTime: formatTime(classDate),
                                details: recordClass.recodeClassName
                            });
                        }
                    }
                });

                // Process resources
                lesson.resources.forEach(resource => {
                    const resourceDate = new Date(resource.resourceDate);
                    if (isSameDay(resourceDate, currentDay)) {
                        dayActivities.push({
                            type: "Resource",
                            details: resource.name,
                            time: formatTime(resourceDate)
                        });

                        if (isDateUpcoming(resourceDate)) {
                            activities.push({
                                type: "Resource",
                                date: formatDate(resourceDate),
                                dueTime: formatTime(resourceDate),
                                details: resource.name
                            });
                        }
                    }
                });

                // Process assignments
                lesson.assignments.forEach(assignment => {
                    const assignmentDate = new Date(assignment.unlockDate);
                    if (isSameDay(assignmentDate, currentDay)) {
                        dayActivities.push({
                            type: "Assignment",
                            details: assignment.assignmentNo,
                            time: formatTime(assignmentDate)
                        });

                        if (isDateUpcoming(assignmentDate)) {
                            activities.push({
                                type: "Assignment",
                                date: formatDate(assignmentDate),
                                dueTime: formatTime(assignmentDate),
                                details: assignment.assignmentNo
                            });
                        }
                    }
                });

                // Process tests
                lesson.tests.forEach(test => {
                    const testDate = new Date(test.publishDate);
                    if (isSameDay(testDate, currentDay)) {
                        dayActivities.push({
                            type: "Exam",
                            details: test.name,
                            time: formatTime(testDate)
                        });

                        if (isDateUpcoming(testDate)) {
                            activities.push({
                                type: "Exam",
                                date: formatDate(testDate),
                                dueTime: formatTime(testDate),
                                details: test.name
                            });
                        }
                    }
                });
            });

            calendarItems.push({
                day: currentDay.getDate(),
                month: currentDay.getMonth(),
                year: currentDay.getFullYear(),
                activities: dayActivities,
                fullDate: new Date(currentDay)
            });
        }

        setCalendarData(calendarItems);

        // Sort upcoming activities by date
        activities.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA.getTime() - dateB.getTime();
        });

        setUpcomingActivities(activities.slice(0, 5)); // Show top 5 upcoming activities
    };

    // Helper functions
    const isSameDay = (date1, date2) => {
        return date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear();
    };

    const isDateUpcoming = (date) => {
        const today = new Date();
        const upcomingLimit = new Date(today);
        upcomingLimit.setDate(today.getDate() + 7); // Next 7 days
        return date >= today && date <= upcomingLimit;
    };

    const formatDate = (date) => {
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        };
        return date.toLocaleDateString('en-US', options);
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    // Generate day names (Sun, Mon, etc)
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Get the current month and year as a string
    const getMonthYear = () => {
        const options: Intl.DateTimeFormatOptions = {
            month: 'long',
            year: 'numeric'
        };
        return currentDate.toLocaleDateString('en-US', options);
    };

    // Handlers for changing the month
    const handlePreviousMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() - 1);
        setCurrentDate(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + 1);
        setCurrentDate(newDate);
    };

    // Handle day click
    const handleDayClick = (day) => {
        setSelectedDay(day);
    };

    // Get activity badge color
    const getActivityColor = (activityType) => {
        switch (activityType) {
            case "Class":
                return "#E0F8E6";
            case "Assignment":
                return "#FFF8E0";
            case "Exam":
                return "#FFE5E5";
            case "Resource":
                return "#E0F2FF";
            default:
                return "#E0F8E6";
        }
    };

    // Get activity text color
    const getActivityTextColor = (activityType) => {
        switch (activityType) {
            case "Class":
                return "#16A34A";
            case "Assignment":
                return "#EAB308";
            case "Exam":
                return "#FF4949";
            case "Resource":
                return "#0284C7";
            default:
                return "#16A34A";
        }
    };

    // Check if a date is today
    const isToday = (date) => {
        const today = new Date();
        return today.getDate() === date.getDate() &&
            today.getMonth() === date.getMonth() &&
            today.getFullYear() === date.getFullYear();
    };

    // Check if a date is in the current month
    const isCurrentMonth = (month) => {
        return month === currentDate.getMonth();
    };

    // Chunk array into weeks (rows of 7)
    const chunkArray = (arr, size) => {
        return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
            arr.slice(i * size, i * size + size)
        );
    };

    const weeksArray = chunkArray(calendarData, 7);

    // Handle publish toggle
    const handlePublishToggle = async (id: string, currentStatus: boolean) => {
        try {
            await publishRoutine({ id, isPublished: !currentStatus }).unwrap();
            setSnackbar({ open: true, message: `Routine ${!currentStatus ? 'published' : 'unpublished'} successfully`, severity: 'success' });
            refetchRoutines();
        } catch {
            setSnackbar({ open: true, message: 'Failed to update routine status', severity: 'error' });
        }
    };

    // Handle create routine
    const handleCreateRoutine = async () => {
        if (!newRoutine.date) {
            setSnackbar({ open: true, message: 'Please select a date', severity: 'error' });
            return;
        }
        try {
            await createRoutine({ course_id: courseId, type: newRoutine.type, date: new Date(newRoutine.date).toISOString() }).unwrap();
            setSnackbar({ open: true, message: 'Routine created successfully', severity: 'success' });
            setShowCreateForm(false);
            setNewRoutine({ type: 'Class', date: '' });
            refetchRoutines();
        } catch {
            setSnackbar({ open: true, message: 'Failed to create routine', severity: 'error' });
        }
    };

    if (isLoading || routinesLoading) {
        return <Loader />;
    }

    return (
        <Box sx={{ borderRadius: '10px', p: 3 }}>
            <Paper variant="outlined" sx={{ borderRadius: '10px', p: 3 }}>
                {/* Header with back button and title */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Link to={user.role === 'teacher' ? `/teacher/course-preview/${courseId}` : `/admin/course-preview/${courseId}`}>
                            <Button variant='outlined' sx={{
                                width: '36px',
                                height: '36px',
                                minWidth: '36px',
                                borderRadius: '8px',
                                borderColor: "grey.700",
                                color: "#3F3F46"
                            }}>
                                <ArrowBackIcon fontSize='small' />
                            </Button>
                        </Link>
                        <Typography variant='h4' sx={{ fontWeight: 600 }}>Course Schedule</Typography>
                    </Box>
                    {/* Add Routine button (teacher only) */}
                    {user.role === 'teacher' && (
                        <Button
                            variant='contained'
                            startIcon={<AddIcon />}
                            onClick={() => setShowCreateForm(!showCreateForm)}
                            sx={{ borderRadius: '8px' }}
                        >
                            {showCreateForm ? 'Cancel' : 'Add Routine'}
                        </Button>
                    )}
                </Box>

                {/* Create Routine Form */}
                {showCreateForm && (
                    <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: '10px', bgcolor: '#F9FAFB' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Create New Routine Entry</Typography>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                            <TextField
                                select
                                label="Type"
                                value={newRoutine.type}
                                onChange={(e) => setNewRoutine(prev => ({ ...prev, type: e.target.value }))}
                                size="small"
                                sx={{ minWidth: 140 }}
                            >
                                {['Class', 'Assignment', 'Exam'].map(t => (
                                    <MenuItem key={t} value={t}>{t}</MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="Date"
                                type="date"
                                value={newRoutine.date}
                                onChange={(e) => setNewRoutine(prev => ({ ...prev, date: e.target.value }))}
                                size="small"
                                InputLabelProps={{ shrink: true }}
                            />
                            <Button variant="contained" onClick={handleCreateRoutine} sx={{ borderRadius: '8px' }}>Create</Button>
                        </Box>
                    </Paper>
                )}

                {/* Routine Entries List */}
                {routinesData?.data?.data?.length > 0 && (
                    <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: '10px' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Routine Entries</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {routinesData.data.data.map((routine: any) => (
                                <Box key={routine._id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Chip
                                            label={routine.type}
                                            size="small"
                                            sx={{
                                                bgcolor: getActivityColor(routine.type),
                                                color: getActivityTextColor(routine.type),
                                                fontWeight: 500
                                            }}
                                        />
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            {new Date(routine.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Chip
                                            label={routine.isPublished ? 'Published' : 'Draft'}
                                            size="small"
                                            color={routine.isPublished ? 'success' : 'default'}
                                            variant={routine.isPublished ? 'filled' : 'outlined'}
                                        />
                                        {user.role === 'teacher' && (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={routine.isPublished ? <UnpublishedIcon /> : <PublishIcon />}
                                                color={routine.isPublished ? 'warning' : 'success'}
                                                onClick={() => handlePublishToggle(routine._id, routine.isPublished)}
                                                sx={{ borderRadius: '8px', textTransform: 'none' }}
                                            >
                                                {routine.isPublished ? 'Unpublish' : 'Publish'}
                                            </Button>
                                        )}
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                )}

                {/* Calendar Section */}
                <Grid container spacing={2}>
                    {/* Calendar part - 70% */}
                    <Grid size={8}>
                        {/* Month navigation */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={handlePreviousMonth}
                                sx={{
                                    minWidth: '40px',
                                    height: '40px',
                                    p: 0,
                                    backgroundColor: 'transparent',
                                    borderRadius: '8px',
                                    border: '1px solid #D1D5DB',
                                    color: "#4B5563"
                                }}
                            >
                                <ArrowBackIosNewIcon fontSize="small" />
                            </Button>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>{getMonthYear()}</Typography>
                            <Button
                                variant="outlined"
                                onClick={handleNextMonth}
                                sx={{
                                    minWidth: '40px',
                                    height: '40px',
                                    p: 0,
                                    backgroundColor: 'transparent',
                                    borderRadius: '8px',
                                    border: '1px solid #D1D5DB',
                                    color: "#4B5563"
                                }}
                            >
                                <ArrowForwardIosIcon fontSize="small" />
                            </Button>
                        </Box>

                        {/* Days of week */}
                        <Grid container sx={{ mb: 1 }}>
                            {dayNames.map((day, index) => (
                                <Grid key={index} size={12 / 7} sx={{ textAlign: 'center' }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#4B5563' }}>
                                        {day}
                                    </Typography>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Calendar grid */}
                        {weeksArray.map((week, weekIndex) => (
                            <Grid container key={weekIndex} sx={{ mb: 1 }}>
                                {week.map((day, dayIndex) => {
                                    const isCurrentDay = isToday(day.fullDate);
                                    const inCurrentMonth = isCurrentMonth(day.month);
                                    const isSelected = selectedDay && isSameDay(selectedDay.fullDate, day.fullDate);

                                    return (
                                        <Grid key={dayIndex} size={12 / 7} sx={{
                                            border: '1px solid #E5E7EB',
                                            p: 1,
                                            height: '120px',
                                            bgcolor: isCurrentDay ? '#EFF6FF' : isSelected ? '#F3F4F6' : 'transparent',
                                            position: 'relative',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                bgcolor: !isCurrentDay ? '#F9FAFB' : '#EFF6FF'
                                            }
                                        }}
                                            onClick={() => handleDayClick(day)}
                                        >
                                            <Typography
                                                sx={{
                                                    position: 'absolute',
                                                    top: 1,
                                                    left: 1,
                                                    p: 1,
                                                    color: inCurrentMonth ? (isCurrentDay ? '#2563EB' : 'text.primary') : 'text.secondary',
                                                    fontWeight: isCurrentDay || isSelected ? 700 : 400,
                                                }}
                                            >
                                                {day.day}
                                            </Typography>
                                            <Box sx={{ pt: 4 }}>
                                                {day.activities.map((activity, actIndex) => (
                                                    <Box
                                                        key={actIndex}
                                                        sx={{
                                                            bgcolor: getActivityColor(activity.type),
                                                            color: getActivityTextColor(activity.type),
                                                            p: 0.5,
                                                            borderRadius: '4px',
                                                            fontSize: '12px',
                                                            textAlign: 'center',
                                                            mb: 0.5,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                            fontWeight: 500
                                                        }}
                                                        title={`${activity.details} - ${activity.time}`}
                                                    >
                                                        {activity.type}
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        ))}
                    </Grid>

                    {/* Upcoming Activity Section - 30% */}
                    <Grid size={4}>
                        <Paper elevation={0} sx={{ pl: 2, borderLeft: '1px solid #E5E7EB', height: '100%' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                Upcoming Activity
                            </Typography>

                            {upcomingActivities.length > 0 ? (
                                upcomingActivities.map((activity, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            mb: 3,
                                            pb: 3,
                                            borderBottom: index < upcomingActivities.length - 1 ? '1px solid #E5E7EB' : 'none'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'inline-block',
                                                bgcolor: getActivityColor(activity.type),
                                                color: getActivityTextColor(activity.type),
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: '4px',
                                                fontSize: '14px',
                                                fontWeight: 500,
                                                mb: 1
                                            }}
                                        >
                                            {activity.type}
                                        </Box>
                                        <Typography sx={{ fontSize: '14px', fontWeight: 500, mb: 0.5 }}>
                                            {activity.date}
                                        </Typography>
                                        <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
                                            Due till {activity.dueTime}
                                        </Typography>
                                        {activity.details && (
                                            <Typography sx={{ fontSize: '14px', fontWeight: 500, mt: 0.5, color: 'text.secondary' }}>
                                                {activity.details}
                                            </Typography>
                                        )}
                                    </Box>
                                ))
                            ) : (
                                <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
                                    No upcoming activities in the next 7 days
                                </Typography>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>

            {/* Snackbar for feedback */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Routine;