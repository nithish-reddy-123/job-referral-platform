import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import jobReducer from './slices/jobSlice';
import referralReducer from './slices/referralSlice';
import companyReducer from './slices/companySlice';
import messageReducer from './slices/messageSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    referrals: referralReducer,
    companies: companyReducer,
    messages: messageReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setUser'],
      },
    }),
  devTools: import.meta.env.DEV,
});
