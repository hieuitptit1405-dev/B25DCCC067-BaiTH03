import { combineReducers, configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';
import cartReducer from '../features/cart/cartSlice';
import { loadCartState, saveCartState } from '../features/cart/cartStorage';

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const preloadedCart = loadCartState();

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: preloadedCart ? { cart: preloadedCart } : undefined,
});

let lastCart = store.getState().cart;
store.subscribe(() => {
  const { cart } = store.getState();
  if (cart !== lastCart) {
    lastCart = cart;
    saveCartState(cart);
  }
});

export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];
