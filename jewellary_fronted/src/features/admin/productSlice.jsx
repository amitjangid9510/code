import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/api';

export const uploadProduct = createAsyncThunk(
  'products/uploadProduct',
  async (formData, thunkAPI) => {
    try {
      const res = await axios.post('/products', formData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, thunkAPI) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const res = await axios.get(`/products?${queryString}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const fetchSingleProduct = createAsyncThunk(
  'products/fetchSingleProduct',
  async (productId, thunkAPI) => {
    try {
      const res = await axios.get(`/products/product/${productId}`);     
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId, thunkAPI) => {
    try {
      const res = await axios.delete(`/products/product/${productId}`);
      return { deletedId: productId, ...res.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ productId, formData }, thunkAPI) => {
    try {
      const res = await axios.post(`/products/update/${productId}`, formData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

const productSlice = createSlice({
  name: 'adminProducts',
  initialState: {
    data: [],
    currentProduct: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      totalPages: 0,
      totalProducts: 0,
      limit: 10
    },
    filters: {},
    deleteStatus: 'idle'
  },
  reducers: {
    resetProductsState: (state) => {
      state.data = [];
      state.currentProduct = null;
      state.loading = false;
      state.error = null;
      state.pagination = {
        page: 1,
        totalPages: 0,
        totalProducts: 0,
        limit: 10
      };
      state.filters = {};
      state.deleteStatus = 'idle';
    },
    setItemsPerPage: (state, action) => {
      state.pagination.limit = action.payload;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    resetDeleteStatus: (state) => {
      state.deleteStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.data.unshift(action.payload.data);
      })
      .addCase(uploadProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          totalProducts: action.payload.totalProducts,
          limit: action.payload.limit || state.pagination.limit
        };
        state.filters = action.meta?.arg || {};
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchSingleProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload.data;
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteProduct.pending, (state) => {
        state.deleteStatus = 'pending';
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        state.data = state.data.filter(
          product => product._id !== action.payload.deletedId
        );
        if (state.pagination.totalProducts > 0) {
          state.pagination.totalProducts -= 1;
          state.pagination.totalPages = Math.ceil(
            state.pagination.totalProducts / state.pagination.limit
          );
        }
        if (state.currentProduct?._id === action.payload.deletedId) {
          state.currentProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.error = action.payload;
      })

    .addCase(updateProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.data = state.data.map(product => 
        product._id === action.payload.data._id ? action.payload.data : product
      );
      if (state.currentProduct?._id === action.payload.data._id) {
        state.currentProduct = action.payload.data;
      }
    })
    .addCase(updateProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { resetProductsState, setItemsPerPage, clearCurrentProduct, resetDeleteStatus } = productSlice.actions;
export default productSlice.reducer;