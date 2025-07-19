import { useState, useEffect, useRef } from 'react';
import {Box, Typography, TextField, IconButton, Avatar, Divider, Paper, Button} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useGetChatHistoryQuery, useMarkMessagesAsReadMutation } from '../../../../redux/features/chat/chatApi';
import { useAppSelector, useAppDispatch } from '../../../../redux/hooks';
import { format } from 'date-fns';
import useSocket from '../../../../shared/hooks/useSocket';
import {
    addMessage,
    setMessages,
    clearUnreadCount,
    markConversationAsResolved
} from '../../../../redux/features/chat/chatSlice';
import { IChatMessage } from '../../../../types/chat.types';
import { TUser } from '../../../../types/types';
import LinearLoader from '../../../../shared/components/LinearLoader';

interface ChatWindowProps {
    conversationId: string;
}

const ChatWindow = ({ conversationId }: ChatWindowProps) => {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messageEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const dispatch = useAppDispatch();
    const socketService = useSocket();
    const { user } = useAppSelector(state => state.auth) as { user: TUser; };
    const messages = useAppSelector(state => state.chat.messages[conversationId] || []);
    const conversations = useAppSelector(state => state.chat.conversations);
    const typingStatus = useAppSelector(state => state.chat.typingUsers[conversationId] || false);

    // Find the current conversation
    const currentConversation = conversations.find(conv => conv.conversation_id === conversationId);
    const RESOLVED_MESSAGE = "Your doubt is solved. Thank you";

    const isResolved = messages.length > 0 && messages[messages.length - 1].message === RESOLVED_MESSAGE;



    const recipientId = typeof currentConversation?.student_id === 'object'
        ? (currentConversation?.student_id as { _id: string; })?._id
        : currentConversation?.student_id;

    // Query for chat history
    const { data: chatHistoryData, isLoading } = useGetChatHistoryQuery({ conversationId });

    // Mutation for marking messages as read
    const [markAsRead] = useMarkMessagesAsReadMutation();

    // Join conversation room when component mounts
    useEffect(() => {
        console.log(`Joining conversation room: ${conversationId}`);
        socketService.joinConversation(conversationId);

        // Mark messages as read
        markAsRead(conversationId)
            .then(() => {
                console.log(`Marked messages as read for conversation: ${conversationId}`);
                dispatch(clearUnreadCount(conversationId));
            })
            .catch(err => console.error('Error marking messages as read:', err));

        // Return cleanup function to leave room when component unmounts
        return () => {
            console.log(`Leaving conversation room: ${conversationId}`);
            socketService.leaveConversation(conversationId);
        };
    }, [conversationId, socketService, markAsRead, dispatch]);

    // Load initial messages from API and set up polling for new messages
    useEffect(() => {
        const loadMessages = async () => {
            try {
                if (chatHistoryData?.data?.messages) {
                    console.log(`Loaded ${chatHistoryData.data.messages.length} messages for conversation ${conversationId}`);
                    dispatch(setMessages({
                        conversationId,
                        messages: chatHistoryData.data.messages
                    }));
                }
            } catch (error) {
                console.error('Error loading messages:', error);
            }
        };

        loadMessages();

        // Poll for new messages every 15 seconds as a fallback if sockets fail
        const intervalId = setInterval(() => {
            console.log('Polling for new messages');
            markAsRead(conversationId).catch(err => console.error('Error marking messages as read:', err));
        }, 15000);

        return () => clearInterval(intervalId);
    }, [chatHistoryData, conversationId, dispatch, markAsRead]);

    // Mark messages as read when conversation is opened
    useEffect(() => {
        if (conversationId) {
            markAsRead(conversationId);
            dispatch(clearUnreadCount(conversationId));
        }
    }, [conversationId, markAsRead, dispatch]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Auto-focus the input field
    useEffect(() => {
        inputRef.current?.focus();
    }, [conversationId]);

    // Handle sending message
    const handleSendMessage = () => {
        if (!message.trim() || !recipientId) return;

        // Create a temporary message object for optimistic UI update
        const tempMessage: IChatMessage = {
            _id: `temp-${Date.now()}`,
            sender_id: (user as TUser)?.registeredId || '',
            sender_role: 'teacher',
            recipient_id: recipientId,
            conversation_id: conversationId,
            message: message.trim(),
            read: false,
            createdAt: new Date().toISOString()
        };

        // Add to local state for immediate display
        dispatch(addMessage({
            conversationId,
            message: tempMessage
        }));

        // Send via socket
        console.log('Sending message with payload:', {
            conversation_id: conversationId,
            message: message.trim(),
            recipient_id: recipientId
        });
        // Before sending the message
        if (!socketService.isConnected()) {
            console.error('Socket not connected. Attempting to reconnect...');
            // socketService.connect(token);
            return; // Don't send if not connected
        }
        socketService.sendMessage({
            conversation_id: conversationId,
            message: message.trim(),
            recipient_id: recipientId
        });

        // Clear input
        setMessage('');

        // Cancel typing indicator
        if (isTyping) {
            socketService.stopTyping(conversationId);
            setIsTyping(false);

            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        }
    };

    // Handle typing indicator
    const handleTyping = () => {
        if (!isTyping) {
            socketService.typing(conversationId);
            setIsTyping(true);
        }

        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set new timeout
        typingTimeoutRef.current = setTimeout(() => {
            socketService.stopTyping(conversationId);
            setIsTyping(false);
        }, 3000);
    };

    // Format time for display
    const formatMessageTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            // Check if date is valid
            if (isNaN(date.getTime())) {
                return 'Invalid time';
            }
            return format(date, 'h:mm a');
        } catch (error) {
            console.error('Error formatting message time:', error);
            return 'Invalid time';
        }
    };

    // Group messages by date
    const groupMessagesByDate = () => {
        const groups: { [key: string]: IChatMessage[]; } = {};

        messages.forEach(msg => {
            try {
                const date = new Date(msg.createdAt);
                // Check if date is valid
                if (isNaN(date.getTime())) {
                    const key = 'Unknown Date';
                    if (!groups[key]) {
                        groups[key] = [];
                    }
                    groups[key].push(msg);
                } else {
                    const key = format(date, 'MMMM d, yyyy');
                    if (!groups[key]) {
                        groups[key] = [];
                    }
                    groups[key].push(msg);
                }
            } catch (error) {
                console.error('Error grouping message by date:', error);
                const key = 'Unknown Date';
                if (!groups[key]) {
                    groups[key] = [];
                }
                groups[key].push(msg);
            }
        });

        return groups;
    };

    const messageGroups = groupMessagesByDate();

    if (!currentConversation) {
        return (
            <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                    Conversation not found
                </Typography>
            </Box>
        );
    }

    const handleMarkAsResolved = () => {
        if (!recipientId) return;

        // The button's only job is to send the resolution message
        socketService.sendMessage({
            conversation_id: conversationId,
            message: RESOLVED_MESSAGE,
            recipient_id: recipientId
        });
    };



    return (
        <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Chat header */}
            <Box sx={{
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar alt={currentConversation.participant.name} src="/static/images/avatar/1.jpg" />
                    <Box>
                        <Typography variant="subtitle1" fontWeight="medium">
                            {currentConversation.participant.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {currentConversation.subject}
                        </Typography>
                    </Box>
                </Box>
                {!isResolved && (
                    <Button onClick={handleMarkAsResolved}>
                        Mark as Resolved
                    </Button>
                )}
            </Box>

            {/* Messages area */}
            <Box sx={{
                flexGrow: 1,
                overflow: 'auto',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1
            }}>
                {isLoading ? (
                    <LinearLoader />
                ) : (
                    Object.entries(messageGroups).map(([date, msgs]) => (
                        <Box key={date}>
                            {/* Date divider */}
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 2,
                                mt: 2
                            }}>
                                <Divider sx={{ flexGrow: 1 }} />
                                <Typography
                                    variant="caption"
                                    color="textSecondary"
                                    sx={{ mx: 2 }}
                                >
                                    {date}
                                </Typography>
                                <Divider sx={{ flexGrow: 1 }} />
                            </Box>

                            {/* Messages for this date */}
                            {msgs.map((msg) => {
                                const isOwnMessage = msg.sender_role === 'teacher';

                                return (
                                    <Box
                                        key={msg._id}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                                            mb: 1
                                        }}
                                    >
                                        {!isOwnMessage && (
                                            <Avatar
                                                alt={currentConversation.participant.name}
                                                src="/static/images/avatar/1.jpg"
                                                sx={{ mr: 1, width: 32, height: 32 }}
                                            />
                                        )}

                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 1.5,
                                                borderRadius: 2,
                                                maxWidth: '70%',
                                                backgroundColor: isOwnMessage ? 'primary.main' : 'grey.100',
                                                color: isOwnMessage ? 'white' : 'text.primary'
                                            }}
                                        >
                                            <Typography variant="body1">
                                                {msg.message}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                color={isOwnMessage ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'}
                                                sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}
                                            >
                                                {formatMessageTime(msg.createdAt)}
                                                {isOwnMessage && (
                                                    <span style={{ marginLeft: '4px' }}>
                                                        {msg.read ? '✓✓' : '✓'}
                                                    </span>
                                                )}
                                            </Typography>
                                        </Paper>
                                    </Box>
                                );
                            })}
                        </Box>
                    ))
                )}

                {typingStatus && (
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, mb: 1 }}>
                        <Avatar
                            alt={currentConversation.participant.name}
                            src="/static/images/avatar/1.jpg"
                            sx={{ mr: 1, width: 24, height: 24 }}
                        />
                        <Paper
                            elevation={0}
                            sx={{
                                py: 1,
                                px: 2,
                                borderRadius: 2,
                                backgroundColor: 'grey.100'
                            }}
                        >
                            <Typography variant="body2" color="textSecondary">
                                Typing...
                            </Typography>
                        </Paper>
                    </Box>
                )}

                <div ref={messageEndRef} />
            </Box>

            {/* Message input */}
            <Box sx={{
                p: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                {isResolved ? (
                    <Typography variant="body1" color="textSecondary" sx={{ width: '100%', textAlign: 'center' }}>
                        This conversation is resolved.
                    </Typography>
                ) : (
                    <>
                <TextField
                    fullWidth
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                        handleTyping();
                    }}
                    inputRef={inputRef}
                    size="small"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 4
                        }
                    }}
                />
                <IconButton
                    color="primary"
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                >
                    <SendIcon />
                </IconButton>
                    </>
                )}
            </Box>

        </Box>
    );
};

export default ChatWindow;