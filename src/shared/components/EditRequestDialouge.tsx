import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    IconButton,
    Typography,
    CircularProgress,
    SelectChangeEvent
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRequestEditMutation } from '../../redux/features/notificationApi';
import { IEditRequestPayload } from '../../types/notification.types';

interface EditRequestDialogProps {
    open: boolean;
    onClose: () => void;
    resourceId: string;
    resourceType?: 'Course' | 'Assignment' | 'RecodedClass' | 'Resource' | 'Test';
}

const EditRequestDialog: React.FC<EditRequestDialogProps> = ({
                                                                 open,
                                                                 onClose,
                                                                 resourceId,
                                                                 resourceType: initialResourceType
                                                             }) => {
    const [requestEdit, { isLoading, isSuccess }] = useRequestEditMutation();

    const [formData, setFormData] = useState<IEditRequestPayload>({
        resourceType: initialResourceType || 'Course',
        resourceId,
        title: '',
        message: ''
    });

    const [formErrors, setFormErrors] = useState({
        title: false,
        message: false
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
    ) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name as string]: value
        });

        // Clear error when typing
        if (name === 'title' || name === 'message') {
            setFormErrors({
                ...formErrors,
                [name]: false
            });
        }
    };

    const handleSubmit = async () => {
        // Validate form
        const newErrors = {
            title: !formData.title.trim(),
            message: !formData.message.trim()
        };

        setFormErrors(newErrors);

        // If there are errors, don't submit
        if (newErrors.title || newErrors.message) {
            return;
        }

        try {
            await requestEdit(formData).unwrap();
            // Reset form on success
            setFormData({
                resourceType: initialResourceType || 'Course',
                resourceId,
                title: '',
                message: ''
            });

            // Close dialog after a brief delay to show success state
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (error) {
            console.error('Failed to send edit request:', error);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Edit Request</Typography>
                    <IconButton onClick={onClose} edge="end">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="resource-type-label">Resource Type</InputLabel>
                        <Select
                            labelId="resource-type-label"
                            id="resource-type"
                            name="resourceType"
                            value={formData.resourceType}
                            onChange={handleChange}
                            label="Resource Type"
                        >
                            <MenuItem value="Course">Course</MenuItem>
                            <MenuItem value="Assignment">Assignment</MenuItem>
                            <MenuItem value="RecodedClass">Recorded Class</MenuItem>
                            <MenuItem value="Resource">Resource</MenuItem>
                            <MenuItem value="Test">Test</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        margin="normal"
                        fullWidth
                        label="Request Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        error={formErrors.title}
                        helperText={formErrors.title ? "Title is required" : ""}
                        placeholder="E.g., Please update course description"
                    />

                    <TextField
                        margin="normal"
                        fullWidth
                        label="Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        error={formErrors.message}
                        helperText={formErrors.message ? "Message is required" : ""}
                        placeholder="Explain what changes are needed"
                        multiline
                        rows={4}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={isLoading || isSuccess}
                    startIcon={isLoading ? <CircularProgress size={20} /> : null}
                >
                    {isSuccess ? "Sent!" : isLoading ? "Sending..." : "Send Request"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditRequestDialog;