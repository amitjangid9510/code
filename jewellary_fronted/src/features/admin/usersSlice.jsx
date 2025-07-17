import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/api';

export const gettAllUsers = createAsyncThunk(
  'users/gettAllUsers',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get('/users');
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1
    }
  },
  reducers: {
    resetUsersState: (state) => {
      state.users = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(gettAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(gettAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;  
        state.pagination = action.payload.pagination; 
      })
      .addCase(gettAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUsersState } = usersSlice.actions;
export default usersSlice.reducer;