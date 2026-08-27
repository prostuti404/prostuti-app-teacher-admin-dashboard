import { useState } from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../../../redux/hooks';
import { format, formatDistanceToNow } from 'date-fns';
import { useAcceptBroadcastMutation, useDeclineBroadcastMutation } from '../../../../redux/features/chat/chatApi';
import { setActiveConversation, removePendingBroadcast } from '../../../../redux/features/chat/chatSlice';
import useSocket from '../../../../shared/hooks/useSocket';
import { IBroadcastRequest } from '../../../../types/chat.types';
import {useGetTeacherProfileQuery} from "../../../../redux/features/teacher/teacherApi.ts";

const BroadcastRequests = () => {
    const pendingBroadcasts = useAppSelector(state => state.chat.pendingBroadcasts);
    const dispatch = useAppDispatch();
    const socketService = useSocket();

    // API mutations
    const [acceptBroadcast] = useAcceptBroadcastMutation();
    const [declineBroadcast] = useDeclineBroadcastMutation();
    const { data: teacherProfile } = useGetTeacherProfileQuery({});

    // State for confirmation dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedBroadcast, setSelectedBroadcast] = useState<IBroadcastRequest | null>(null);
    const [actionType, setActionType] = useState<'accept' | 'decline'>('accept');

    const filteredBroadcasts = pendingBroadcasts.filter(broadcast => {
        const teacherSubjects: string[] = teacherProfile?.data?.subjects || [];
        if (teacherSubjects.length > 0 && broadcast.subject) {
            return teacherSubjects.some(
                (s: string) => s.toLowerCase() === broadcast.subject.toLowerCase()
            );
        }
        return false;
    });


    // Handle accepting a broadcast request
    const handleAccept = async (broadcast: IBroadcastRequest) => {
        try {
            const response = await acceptBroadcast(broadcast._id).unwrap();
            // Emit socket event
            socketService.acceptBroadcast(broadcast._id);

            // Remove from pending broadcasts
            dispatch(removePendingBroadcast(broadcast._id));

            // Set as active conversation
            if (response?.data?.conversation_id) {
                dispatch(setActiveConversation(response.data.conversation_id));
            }

            setDialogOpen(false);
        } catch (error) {
            console.error('Error accepting broadcast:', error);
        }
    };

    // Handle declining a broadcast request
    const handleDecline = async (broadcast: IBroadcastRequest) => {
        try {
            await declineBroadcast(broadcast._id).unwrap();
            // Emit socket event
            socketService.declineBroadcast(broadcast._id);

            // Remove from pending broadcasts
            dispatch(removePendingBroadcast(broadcast._id));

            setDialogOpen(false);
        } catch (error) {
            console.error('Error declining broadcast:', error);
        }
    };

    // Open confirmation dialog
    const openConfirmDialog = (broadcast: IBroadcastRequest, action: 'accept' | 'decline') => {
        setSelectedBroadcast(broadcast);
        setActionType(action);
        setDialogOpen(true);
    };

    // Format time for display
    const formatTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            // Check if date is valid
            if (isNaN(date.getTime())) {
                return 'Invalid date';
            }
            return formatDistanceToNow(date, { addSuffix: true });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid date';
        }
    };

    // Format expiry time
    const formatExpiryTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            // Check if date is valid
            if (isNaN(date.getTime())) {
                return 'Invalid date';
            }
            return format(date, "MMM dd, yyyy 'at' h:mm a");
        } catch (error) {
            console.error('Error formatting expiry date:', error);
            return 'Invalid date';
        }
    };

    return (
        <>
            {filteredBroadcasts.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography color="textSecondary">No pending requests</Typography>
                </Box>
            ) : (
                <List sx={{ width: '100%', p: 0 }}>
                    {filteredBroadcasts.map((broadcast) => (
                        <ListItem
                            key={broadcast._id}
                            alignItems="flex-start"
                            divider
                            sx={{
                                p: 2,
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                }
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar alt={broadcast.student_id.name} src="/static/images/avatar/1.jpg" />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography
                                        component="span"
                                        variant="subtitle1"
                                        fontWeight="medium"
                                    >
                                        {broadcast.student_id.name} - {broadcast.subject}
                                    </Typography>
                                }
                                secondary={
                                    <>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                            display="block"
                                        >
                                            {broadcast.message}
                                        </Typography>
                                        <Typography
                                            component="span"
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            {formatTime(broadcast.createdAt)} •
                                            Expires: {formatExpiryTime(broadcast.expiry_time)}
                                        </Typography>
                                        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => openConfirmDialog(broadcast, 'accept')}
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => openConfirmDialog(broadcast, 'decline')}
                                            >
                                                Decline
                                            </Button>
                                        </Box>
                                    </>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            )}

            {/* Confirmation Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
            >
                <DialogTitle>
                    {actionType === 'accept' ? 'Accept Broadcast Request?' : 'Decline Broadcast Request?'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {actionType === 'accept'
                            ? 'Are you sure you want to accept this request? You will start a conversation with the student.'
                            : 'Are you sure you want to decline this request?'
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={() => {
                            if (selectedBroadcast) {
                                if (actionType === 'accept') {
                                    handleAccept(selectedBroadcast);
                                } else {
                                    handleDecline(selectedBroadcast);
                                }
                            }
                        }}
                        autoFocus
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BroadcastRequests;