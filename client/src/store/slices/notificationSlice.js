import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/notifications', { params });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/notifications/${id}/read`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await api.patch('/notifications/read-all');
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    unreadCount: 0,
    isLoading: false,
  },
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notif = state.notifications.find(
          (n) => n._id === action.payload.notification._id
        );
        if (notif) {
          notif.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => (n.isRead = true));
        state.unreadCount = 0;
      });
  },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
