import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/api'; 

export const loadUser = createAsyncThunk(
  'userAuth/loadUser',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get('/auth/me');
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Unable to load user'
      );
    }
  }
);

export const signupUser = createAsyncThunk(
  'userAuth/signupUser',
  async (userData, thunkAPI) => {
    try {
      const res = await axios.post('/auth/signup', userData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const verifySignUpOtp = createAsyncThunk(
  'userAuth/verifyOtp',
  async (otpData, thunkAPI) => {
    try {
      const res = await axios.post('/auth/verify-signup-otp', otpData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  'userAuth/loginUser',
  async (credentials, thunkAPI) => {
    try {
      const res = await axios.post('/auth/login', credentials);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'userAuth/logoutUser',
  async (_, thunkAPI) => {
    try {
      await axios.post('/auth/logout');
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  'userAuth/updateUser',
  async (userData, thunkAPI) => {
    try {
      const res = await axios.post('/users/user', userData);
      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

const authSlice = createSlice({
  name: 'userAuth',
  initialState: {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(verifySignUpOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifySignUpOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(verifySignUpOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;