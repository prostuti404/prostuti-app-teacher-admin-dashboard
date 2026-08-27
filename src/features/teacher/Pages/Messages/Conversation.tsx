import {List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Box, Badge, Chip} from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../../../redux/hooks';
import { formatDistanceToNow } from 'date-fns';
import { setActiveConversation } from '../../../../redux/features/chat/chatSlice';

const Conversations = () => {
    const conversations = useAppSelector(state => state.chat.conversations);
    const unreadCounts = useAppSelector(state => state.chat.unreadCounts);
    const activeConversationId = useAppSelector(state => state.chat.activeConversationId);
    const dispatch = useAppDispatch();

    // Handle conversation selection
    const handleSelectConversation = (conversationId: string) => {
        dispatch(setActiveConversation(conversationId));
    };
    const RESOLVED_MESSAGE = "Your doubt is solved. Thank you";
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

    // Helper to truncate long messages
    const truncateMessage = (message: string, maxLength = 50) => {
        if (message.length <= maxLength) return message;
        return `${message.substring(0, maxLength)}...`;
    };

    return (
        <>
            {conversations.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography color="textSecondary">No active conversations</Typography>
                </Box>
            ) : (
                <List sx={{ width: '100%', p: 0 }}>
                    {conversations.map((conversation) => {
                        const unreadCount = unreadCounts[conversation.conversation_id] || 0;
                        const isActive = activeConversationId === conversation.conversation_id;
                        const isResolved = conversation.lastMessage?.message === RESOLVED_MESSAGE;

                        return (
                            <ListItem
                                key={conversation.conversation_id}
                                alignItems="flex-start"
                                divider
                                onClick={() => handleSelectConversation(conversation.conversation_id)}
                                sx={{
                                    p: 2,
                                    cursor: 'pointer',
                                    backgroundColor: isResolved ? '#FFFFFF' : (isActive ? 'rgba(0, 0, 0, 0.04)' : 'transparent'),
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                    }
                                }}
                            >
                                <ListItemAvatar>
                                    <Badge
                                        overlap="circular"
                                        badgeContent={unreadCount}
                                        color="primary"
                                        invisible={unreadCount === 0}
                                    >
                                        <Avatar alt={conversation.participant.name} src="/static/images/avatar/1.jpg" />
                                    </Badge>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography
                                            component="span"
                                            variant="subtitle1"
                                            fontWeight={unreadCount > 0 ? "bold" : "medium"}
                                        >
                                            {conversation.participant.name}
                                        </Typography>
                                            {isResolved && (
                                                <Chip label="Resolved" size="small" />
                                            )}
                                        </Box>
                                    }
                                    secondary={
                                        <>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                                fontWeight={unreadCount > 0 ? "medium" : "regular"}
                                            >
                                                {conversation.lastMessage
                                                    ? truncateMessage(conversation.lastMessage.message)
                                                    : conversation.subject
                                                }
                                            </Typography>
                                            <Typography
                                                component="span"
                                                variant="caption"
                                                color="text.secondary"
                                                display="block"
                                            >
                                                {conversation.lastMessage
                                                    ? formatTime(conversation.lastMessage.createdAt)
                                                    : formatTime(conversation.createdAt)
                                                }
                                            </Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                        );
                    })}
                </List>
            )}
        </>
    );
};

export default Conversations;