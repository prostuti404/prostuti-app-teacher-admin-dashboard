// Broadcast request
export interface IBroadcastRequest {
    _id: string;
    student_id: {
        _id: string;
        registeredId: string;
        name: string;
        categoryType: string;
    };
    message: string;
    subject: string;
    status: 'pending' | 'accepted' | 'declined' | 'expired';
    accepted_by?: string;
    conversation_id?: string;
    expiry_time: string;
    createdAt: string;
    updatedAt: string;
}

// Chat message
export interface IChatMessage {
    _id: string;
    sender_id: string;
    sender_role: 'student' | 'teacher';
    recipient_id: string;
    conversation_id: string;
    message: string;
    read: boolean;
    createdAt: string;
    updatedAt?: string;
}

// Conversation (UI Model)
export interface IConversation {
    _id: string;
    student_id: string;
    message: string;
    subject: string;
    status: 'accepted';
    accepted_by: string;
    conversation_id: string;
    expiry_time: string;
    createdAt: string;
    updatedAt: string;
    participant: {
        name: string;
        // Other participant details
    };
    lastMessage?: IChatMessage;
    isResolved?: boolean;
}

// Unread message count
export interface IUnreadCount {
    total: number;
    conversations: {
        _id: string;
        count: number;
        lastMessage: IChatMessage;
    }[];
}

// Socket event types
export type SocketEvents = {
    connect: void;
    disconnect: void;
    authenticated: { success: true };
    authentication_error: { message: string };
    user_connected: { user_id: string, role: string };
    user_disconnected: { user_id: string, role: string };
    new_broadcast_available: IBroadcastRequest;
    broadcast_accepted: { broadcast_id: string, teacher_id: string, conversation_id: string };
    broadcast_request: { success: true, broadcast_id: string };
    broadcast_expired: { broadcast_id: string };
    join_conversation: { success: true, conversation_id: string };
    leave_conversation: { success: true, conversation_id: string };
    receive_message: IChatMessage & { as_notification?: boolean };
    typing: { user_id: string, conversation_id: string };
    stop_typing: { user_id: string, conversation_id: string };
    send_message: { success: true, message_id: string };
    error: { event: string, message: string };
};