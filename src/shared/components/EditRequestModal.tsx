import { useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Box,
    TextField,
    IconButton,
    Typography,
    CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams } from 'react-router-dom';
import { useRequestEditMutation } from '../../redux/features/notificationApi';
import { IEditRequestPayload } from '../../types/notification.types';

interface EditRequestModalProps {
    open: boolean;
    onClose: () => void;
    resourceType: 'Assignment' | 'RecordedClass' | 'Resource' | 'Notice' | 'Test' | 'Flashcard';
    resourceId?: string; // Add optional resourceId prop
}

const EditRequestModal = ({ open, onClose, resourceType, resourceId: propResourceId }: EditRequestModalProps) => {
    const [requestTitle, setRequestTitle] = useState('');
    const [requestDescription, setRequestDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const { assignmentId, recordId, resourceId, noticeId, testId, flashcardId } = useParams<{
        assignmentId?: string;
        recordId?: string;
        resourceId?: string;
        noticeId?: string;
        testId?: string;
        flashcardId?: string;
    }>();

    // Use the requestEdit mutation hook
    const [requestEdit, { isLoading, isSuccess }] = useRequestEditMutation();

    // Determine which ID to use based on the resource type
    const getResourceIdFromParams = () => {
        switch (resourceType) {
            case 'Assignment':
                return assignmentId;
            case 'RecordedClass':
                return recordId;
            case 'Resource':
                return resourceId;
            case 'Notice':
                return noticeId;
            case 'Test':
                return testId;
            case 'Flashcard':
                return flashcardId;
            default:
                return null;
        }
    };

    // Use the resourceId prop if provided, otherwise try to get it from URL params
    const currentResourceId = propResourceId || getResourceIdFromParams();

    const handleSubmit = async () => {
        if (!requestDescription.trim() || !currentResourceId) return;

        // Map resource types to the expected API format
        const apiResourceType = resourceType === 'RecordedClass' ? 'RecodedClass' : resourceType;

        // Create payload according to the API requirements
        const payload: IEditRequestPayload = {
            resourceType: apiResourceType as any, // Type casting to match the expected types
            resourceId: currentResourceId,
            title: requestTitle.trim() || `Edit request for ${resourceType.toLowerCase()}`, // Use a default title if not provided
            message: requestDescription
        };

        try {
            // Call the API using the requestEdit mutation
            await requestEdit(payload).unwrap();

            // Show success message
            setShowSuccessMessage(true);

            // Reset form
            setRequestTitle('');
            setRequestDescription('');

            // Close modal after a delay
            setTimeout(() => {
                onClose();
                setShowSuccessMessage(false);
            }, 1500);
        } catch (error) {
            console.error('Error sending edit request:', error);
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <IconButton
                            edge="start"
                            onClick={onClose}
                            aria-label="back"
                            sx={{ p: 0.5 }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h6">
                            Request to edit {resourceType.toLowerCase()} {currentResourceId}
                        </Typography>
                    </Box>
                </DialogTitle>

                <DialogContent>
                    <Box mb={1}>
                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                            Request Title
                        </Typography>
                    </Box>
                    <TextField
                        autoFocus
                        fullWidth
                        value={requestTitle}
                        onChange={(e) => setRequestTitle(e.target.value)}
                        placeholder="Enter a title for your request..."
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />

                    <Box mb={1}>
                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                            Request Description
                        </Typography>
                    </Box>
                    <TextField
                        multiline
                        rows={6}
                        fullWidth
                        value={requestDescription}
                        onChange={(e) => setRequestDescription(e.target.value)}
                        placeholder="Write your request description details here..."
                        variant="outlined"
                    />

                    <Box mt={2}>
                        <Typography variant="caption" color="textSecondary">
                            Note: Question will be deleted automatically after 3 days.
                        </Typography>
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                        disabled={isLoading || !requestDescription.trim() || !currentResourceId}
                        startIcon={isLoading ? <CircularProgress size={20} /> : null}
                    >
                        {isSuccess ? "Sent!" : isLoading ? "Sending..." : "Send Request"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={showSuccessMessage}
                aria-describedby="success-dialog-description"
                maxWidth="xs"
                fullWidth
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    p={3}
                >
                    <Box
                        sx={{
                            bgcolor: 'primary.main',
                            borderRadius: '50%',
                            width: 48,
                            height: 48,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            mb: 2
                        }}
                    >
                        <Box
                            component="svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </Box>
                    </Box>
                    <Typography variant="h6" id="success-dialog-description">
                        Edit request sent successfully
                    </Typography>
                </Box>
            </Dialog>
        </>
    );
};

export default EditRequestModal;