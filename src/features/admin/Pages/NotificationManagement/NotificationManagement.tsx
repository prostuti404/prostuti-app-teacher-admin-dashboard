import { useState } from 'react';
import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import { useSendBulkNotificationMutation } from '../../../../redux/features/notificationApi';
import { useGetCourseForAdminEndQuery } from '../../../../redux/features/course/courseApi';

const NotificationManagement = () => {
    const [sendBulkNotification, { isLoading: isSending }] = useSendBulkNotificationMutation();
    const { data: courseData, isLoading: isLoadingCourses } = useGetCourseForAdminEndQuery({});

    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [targetType, setTargetType] = useState('All');
    const [courseId, setCourseId] = useState('');

    const handleSend = async () => {
        if (!title.trim() || !message.trim()) {
            toast.error('Title and Message are required');
            return;
        }

        if (targetType === 'Course' && !courseId) {
            toast.error('Please select a course');
            return;
        }

        try {
            const result = await sendBulkNotification({
                title,
                message,
                targetType,
                ...(targetType === 'Course' && { courseId })
            }).unwrap();

            toast.success(`Successfully sent ${result.data?.count || 0} notifications!`);
            setTitle('');
            setMessage('');
            setTargetType('All');
            setCourseId('');
        } catch (error) {
            toast.error('Failed to send notifications');
        }
    };

    return (
        <Box sx={{ p: 4, height: '100vh', width: '100%' }}>
            <Paper sx={{ p: 4, borderRadius: 2, maxWidth: 600 }}>
                <Typography variant="h3" mb={4}>Send Notification</Typography>

                <TextField
                    label="Notification Title"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <TextField
                    label="Message"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    margin="normal"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel>Target Audience</InputLabel>
                    <Select
                        value={targetType}
                        label="Target Audience"
                        onChange={(e) => setTargetType(e.target.value)}
                    >
                        <MenuItem value="All">All Students</MenuItem>
                        <MenuItem value="Subscription">Subscribed Users</MenuItem>
                        <MenuItem value="Course">Specific Course</MenuItem>
                    </Select>
                </FormControl>

                {targetType === 'Course' && (
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Select Course</InputLabel>
                        <Select
                            value={courseId}
                            label="Select Course"
                            onChange={(e) => setCourseId(e.target.value)}
                        >
                            {isLoadingCourses ? (
                                <MenuItem disabled>Loading courses...</MenuItem>
                            ) : (
                                courseData?.data?.map((course: any) => (
                                    <MenuItem key={course._id} value={course._id}>
                                        {course.name}
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>
                )}

                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    sx={{ mt: 4 }}
                    onClick={handleSend}
                    disabled={isSending}
                >
                    {isSending ? <CircularProgress size={24} /> : 'Send Notification'}
                </Button>
            </Paper>
        </Box>
    );
};

export default NotificationManagement;
