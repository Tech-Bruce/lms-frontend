import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api'; // make sure this is pointing to axios instance
import { toast } from 'react-toastify';

export const loginUser = createAsyncThunk('auth/loginUser', async (userData, thunkAPI) => {
  try {
    const res = await axios.post('/auth/login', userData);
    localStorage.setItem('token', res.data.token);
    return res.data.user;
  } catch (err) {
    toast.error(err.response.data.msg);
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

export const registerUser = createAsyncThunk('auth/registerUser', async (userData, thunkAPI) => {
  try {
    const res = await axios.post('/auth/register', userData);
    localStorage.setItem('token', res.data.token);
    return res.data.user;
  } catch (err) {
    toast.error(err.response.data.msg);
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
  },
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
