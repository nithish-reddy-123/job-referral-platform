import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchReferrals = createAsyncThunk(
  'referrals/fetchReferrals',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/referrals', { params });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch referrals');
    }
  }
);

export const fetchReferral = createAsyncThunk(
  'referrals/fetchReferral',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/referrals/${id}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch referral');
    }
  }
);

export const createReferral = createAsyncThunk(
  'referrals/createReferral',
  async (referralData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/referrals', referralData);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create referral');
    }
  }
);

export const updateReferralStatus = createAsyncThunk(
  'referrals/updateStatus',
  async ({ id, status, note }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/referrals/${id}/status`, { status, note });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

const referralSlice = createSlice({
  name: 'referrals',
  initialState: {
    referrals: [],
    currentReferral: null,
    pagination: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCurrentReferral: (state) => {
      state.currentReferral = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReferrals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReferrals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.referrals = action.payload.referrals;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchReferrals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchReferral.fulfilled, (state, action) => {
        state.currentReferral = action.payload.referral;
      })
      .addCase(createReferral.fulfilled, (state, action) => {
        state.referrals.unshift(action.payload.referral);
      })
      .addCase(updateReferralStatus.fulfilled, (state, action) => {
        const updated = action.payload.referral;
        const index = state.referrals.findIndex((r) => r._id === updated._id);
        if (index !== -1) state.referrals[index] = updated;
        if (state.currentReferral?._id === updated._id) {
          state.currentReferral = updated;
        }
      });
  },
});

export const { clearCurrentReferral } = referralSlice.actions;
export default referralSlice.reducer;
