import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../utils/api';

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/cart', { 
        productId, 
        quantity: Number(quantity)
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to add to cart');
      }
      
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/cart');
      
      if (!response.data.success && response.data.message !== 'Cart is empty') {
        throw new Error(response.data.message || 'Failed to fetch cart');
      }
      
      return response.data.data || { items: [], total: 0 };
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }, { rejectWithValue, dispatch }) => {
    try {
      if (!productId || quantity === undefined) {
        throw new Error('Product ID and quantity are required');
      }

      const numericQuantity = Number(quantity);
      if (isNaN(numericQuantity)) {
        throw new Error('Quantity must be a number');
      }

      const response = await axios.post('/cart/update', { 
        productId, 
        quantity: numericQuantity 
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update cart item');
      }

      return response.data.data;
    } catch (err) {
      dispatch(fetchCart());
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/cart/${productId}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to remove item');
      }
      
      return { 
        productId, 
        cart: response.data.data 
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete('/cart');
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to clear cart');
      }
      
      return null;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0,
    status: 'idle',
    error: null,
    updatingItems: {}
  },
  reducers: {
    updateQuantityLocally: (state, action) => {
      const { productId, quantity } = action.payload;
      const itemIndex = state.items.findIndex(item => item.product._id === productId);
      
      if (itemIndex !== -1) {
        state.items[itemIndex].quantity = quantity;
        state.updatingItems[productId] = true;
      }
    },
    completeItemUpdate: (state, action) => {
      const { productId } = action.payload;
      delete state.updatingItems[productId];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to add to cart';
      })
      
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
        state.updatingItems = {};
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch cart';
      })
      
      .addCase(updateCartItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to update cart item';
      })
      
      .addCase(removeCartItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.cart.items;
        state.total = action.payload.cart.total;
        state.error = null;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to remove cart item';
      })
      
      .addCase(clearCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.status = 'succeeded';
        state.items = [];
        state.total = 0;
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to clear cart';
      });
  }
});

export const { updateQuantityLocally, completeItemUpdate } = cartSlice.actions;
export default cartSlice.reducer;