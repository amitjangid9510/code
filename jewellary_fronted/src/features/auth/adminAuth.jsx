import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/api'; 

export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (credentials, thunkAPI) => {
    try {
      const res = await axios.post('/admin/login', credentials);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: 'An error occurred' });
    }
  }
);

const authSlice = createSlice({
  name: 'adminAuth',
  initialState: {
    admin: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    token: null
  },
  reducers: {
    clearAdminAuth: (state) => {
      state.admin = null;
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.error = action.payload?.message || 'Login failed';
      });
  },
});

export const { clearAdminAuth } = authSlice.actions;
export default authSlice.reducer;