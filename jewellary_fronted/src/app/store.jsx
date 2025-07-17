import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import adminAuthReducer from '../features/auth/adminAuth';
import adminProductReducer from '../features/admin/productSlice';
import productReducer from '../features/user/productSlice';
import cartReducer from '../features/user/cartSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import usersReducer from '../features/admin/usersSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'cart'], 
};

const rootReducer = combineReducers({
  auth: authReducer,
  adminAuth : adminAuthReducer,
  adminProducts: adminProductReducer,
  cart: cartReducer,
  users: usersReducer,
  products: productReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export const persistor = persistStore(store);



