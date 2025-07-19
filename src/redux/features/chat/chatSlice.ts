import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {IBroadcastRequest, IChatMessage, IConversation} from "../../../types/chat.types.ts";


interface ChatState {
    activeConversationId: string | null;
    messages: Record<string, IChatMessage[]>;
    conversations: IConversation[];
    pendingBroadcasts: IBroadcastRequest[];
    typingUsers: Record<string, boolean>; // conversationId -> isTyping
    unreadCounts: Record<string, number>; // conversationId -> count
}

const initialState: ChatState = {
    activeConversationId: null,
    messages: {},
    conversations: [],
    pendingBroadcasts: [],
    typingUsers: {},
    unreadCounts: {},
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setActiveConversation: (state, action: PayloadAction<string | null>) => {
            state.activeConversationId = action.payload;
        },
        addMessage: (state, action: PayloadAction<{ conversationId: string; message: IChatMessage }>) => {
            const { conversationId, message } = action.payload;
            if (!state.messages[conversationId]) {
                state.messages[conversationId] = [];
            }
            state.messages[conversationId].push(message);
        },
        setMessages: (state, action: PayloadAction<{ conversationId: string; messages: IChatMessage[] }>) => {
            const { conversationId, messages } = action.payload;
            state.messages[conversationId] = messages;
        },
        setConversations: (state, action: PayloadAction<IConversation[]>) => {
            state.conversations = action.payload;
        },
        setPendingBroadcasts: (state, action: PayloadAction<IBroadcastRequest[]>) => {
            state.pendingBroadcasts = action.payload;
        },
        addPendingBroadcast: (state, action: PayloadAction<IBroadcastRequest>) => {
            state.pendingBroadcasts.unshift(action.payload); // Add to beginning of array
        },
        removePendingBroadcast: (state, action: PayloadAction<string>) => {
            state.pendingBroadcasts = state.pendingBroadcasts.filter(
                (broadcast) => broadcast._id !== action.payload
            );
        },
        setTypingStatus: (state, action: PayloadAction<{ conversationId: string; isTyping: boolean }>) => {
            const { conversationId, isTyping } = action.payload;
            state.typingUsers[conversationId] = isTyping;
        },
        setUnreadCounts: (state, action: PayloadAction<Record<string, number>>) => {
            state.unreadCounts = action.payload;
        },
        clearUnreadCount: (state, action: PayloadAction<string>) => {
            state.unreadCounts[action.payload] = 0;
        },
        markConversationAsResolved: (state, action: PayloadAction<string>) => {
            const conversationId = action.payload;
            const conversation = state.conversations.find(c => c.conversation_id === conversationId);
            if (conversation) {
                conversation.isResolved = true;
            }
        },
    },
});

export const {
    setActiveConversation,
    addMessage,
    setMessages,
    setConversations,
    setPendingBroadcasts,
    addPendingBroadcast,
    removePendingBroadcast,
    setTypingStatus,
    setUnreadCounts,
    clearUnreadCount,
    markConversationAsResolved
} = chatSlice.actions;

export default chatSlice.reducer;