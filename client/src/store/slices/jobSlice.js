import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/jobs', { params });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs');
    }
  }
);

export const fetchJob = createAsyncThunk(
  'jobs/fetchJob',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/jobs/${id}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch job');
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/jobs', jobData);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create job');
    }
  }
);

export const toggleBookmark = createAsyncThunk(
  'jobs/toggleBookmark',
  async (jobId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/users/bookmark/${jobId}`);
      return { jobId, bookmarkedJobs: data.data.bookmarkedJobs };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to bookmark');
    }
  }
);

export const fetchMyJobs = createAsyncThunk(
  'jobs/fetchMyJobs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/jobs/my-jobs', { params });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your jobs');
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (jobId, { rejectWithValue }) => {
    try {
      await api.delete(`/jobs/${jobId}`);
      return jobId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete job');
    }
  }
);

const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    myJobs: [],
    currentJob: null,
    pagination: null,
    myJobsPagination: null,
    isLoading: false,
    error: null,
    filters: {
      q: '',
      type: '',
      experienceLevel: '',
      location: '',
      remote: false,
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { q: '', type: '', experienceLevel: '', location: '', remote: false };
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload.jobs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchJob.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentJob = action.payload.job;
      })
      .addCase(fetchJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.jobs.unshift(action.payload.job);
        state.myJobs.unshift(action.payload.job);
      })
      .addCase(fetchMyJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myJobs = action.payload.jobs;
        state.myJobsPagination = action.payload.pagination;
      })
      .addCase(fetchMyJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((j) => j._id !== action.payload);
        state.myJobs = state.myJobs.filter((j) => j._id !== action.payload);
      });
  },
});

export const { setFilters, clearFilters, clearCurrentJob } = jobSlice.actions;
export default jobSlice.reducer;
