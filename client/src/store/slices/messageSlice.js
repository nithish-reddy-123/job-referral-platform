import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchConversations = createAsyncThunk(
  'messages/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/messages/conversations');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async ({ conversationId, page = 1 }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/messages/${conversationId}`, {
        params: { page },
      });
      return { conversationId, messages: data.data.messages };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ conversationId, content }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/messages/${conversationId}`, { content });
      return { conversationId, message: data.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const createConversation = createAsyncThunk(
  'messages/createConversation',
  async ({ participantId, referralId }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/messages/conversations', {
        participantId,
        referralId,
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    conversations: [],
    currentConversation: null,
    messages: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
      state.currentConversation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversations = action.payload.conversations;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload.messages;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload.message);
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        const exists = state.conversations.find(
          (c) => c._id === action.payload.conversation._id
        );
        if (!exists) {
          state.conversations.unshift(action.payload.conversation);
        }
        state.currentConversation = action.payload.conversation;
      });
  },
});

export const { setCurrentConversation, addMessage, clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
