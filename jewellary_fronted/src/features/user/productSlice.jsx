import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/api';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page = 1, limit = 10, search = '', filters = {} }, thunkAPI) => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        search,
        ...filters
      }).toString();
      const res = await axios.get(`/products?${params}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const fetchSingleProduct = createAsyncThunk(
  'products/fetchSingleProduct',
  async (id, thunkAPI) => {
    try {
      const res = await axios.get(`/products/product/${id}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'products/addToWishlist',
  async (productId, thunkAPI) => {
    try {
      const res = await axios.post('/users/wishlist', { productId });
      return { productId, wishlist: res.data.wishlist };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'products/removeFromWishlist',
  async (productId, thunkAPI) => {
    try {
      const res = await axios.delete(`/users/wishlist/${productId}`);
      return { productId, wishlist: res.data.wishlist };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const fetchWishlist = createAsyncThunk(
  'products/fetchWishlist',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get('/users/wishlist');
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    data: [],
    singleProduct: null,
    singleProductStatus: 'idle',
    singleProductError: null,
    wishlist: [],
    wishlistStatus: 'idle',
    wishlistError: null,
    status: 'idle',
    error: null,
    page: 1,
    totalPages: 1,
    totalProducts: 0,
    filters: {
      search: ''
    }
  },
  reducers: {
    clearSingleProduct: (state) => {
      state.singleProduct = null;
      state.singleProductStatus = 'idle';
      state.singleProductError = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.filters.search = action.payload;
      state.page = 1;
    },
    clearSearch: (state) => {
      state.filters.search = '';
    },
    toggleProductFavorite: (state, action) => {
      const { productId, isFavorite } = action.payload;
      const product = state.data.find(p => p._id === productId);
      if (product) {
        product.isFavorite = isFavorite;
      }
      if (state.singleProduct && state.singleProduct._id === productId) {
        state.singleProduct.isFavorite = isFavorite;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload.data.map(product => ({
          ...product,
          isFavorite: state.wishlist.some(item => item._id === product._id)
        }));
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalProducts = action.payload.totalProducts;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || action.error.message;
      })

      .addCase(fetchSingleProduct.pending, (state) => {
        state.singleProductStatus = 'loading';
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.singleProductStatus = 'succeeded';
        state.singleProduct = {
          ...action.payload.data,
          isFavorite: state.wishlist.some(item => item._id === action.payload.data._id)
        };
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        state.singleProductStatus = 'failed';
        state.singleProductError = action.payload?.message || action.error.message;
      })

      .addCase(addToWishlist.pending, (state) => {
        state.wishlistStatus = 'loading';
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.wishlistStatus = 'succeeded';
        state.wishlist = action.payload.wishlist;
        state.data = state.data.map(product => ({
          ...product,
          isFavorite: action.payload.wishlist.some(item => item._id === product._id)
        }));
        if (state.singleProduct) {
          state.singleProduct.isFavorite = action.payload.wishlist.some(
            item => item._id === state.singleProduct._id
          );
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.wishlistStatus = 'failed';
        state.wishlistError = action.payload?.message || action.error.message;
      })

      .addCase(removeFromWishlist.pending, (state) => {
        state.wishlistStatus = 'loading';
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.wishlistStatus = 'succeeded';
        state.wishlist = action.payload.wishlist;
        state.data = state.data.map(product => ({
          ...product,
          isFavorite: action.payload.wishlist.some(item => item._id === product._id)
        }));
        if (state.singleProduct) {
          state.singleProduct.isFavorite = action.payload.wishlist.some(
            item => item._id === state.singleProduct._id
          );
        }
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.wishlistStatus = 'failed';
        state.wishlistError = action.payload?.message || action.error.message;
      })

      .addCase(fetchWishlist.pending, (state) => {
        state.wishlistStatus = 'loading';
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.wishlistStatus = 'succeeded';
        state.wishlist = action.payload.wishlist;
        state.data = state.data.map(product => ({
          ...product,
          isFavorite: action.payload.wishlist.some(item => item._id === product._id)
        }));
        if (state.singleProduct) {
          state.singleProduct.isFavorite = action.payload.wishlist.some(
            item => item._id === state.singleProduct._id
          );
        }
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.wishlistStatus = 'failed';
        state.wishlistError = action.payload?.message || action.error.message;
      });
  }
});

export const { 
  setFilters, 
  setPage, 
  setSearchQuery, 
  clearSearch, 
  clearSingleProduct,
  toggleProductFavorite
} = productSlice.actions;

export default productSlice.reducer;