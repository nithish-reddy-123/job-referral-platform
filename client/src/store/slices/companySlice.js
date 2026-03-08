import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchCompanies = createAsyncThunk(
  'companies/fetchCompanies',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/companies', { params });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch companies');
    }
  }
);

export const fetchCompany = createAsyncThunk(
  'companies/fetchCompany',
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/companies/${slug}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch company');
    }
  }
);

const companySlice = createSlice({
  name: 'companies',
  initialState: {
    companies: [],
    currentCompany: null,
    companyJobs: [],
    pagination: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.companies = action.payload.companies;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCompany.fulfilled, (state, action) => {
        state.currentCompany = action.payload.company;
        state.companyJobs = action.payload.jobs;
      });
  },
});

export default companySlice.reducer;
