import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { CartItem, Product } from '../../types';

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

export const MAX_QUANTITY = 99;

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity?: number }>) => {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find((item) => item.id === product.id);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, MAX_QUANTITY);
      } else {
        state.items.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: Math.min(quantity, MAX_QUANTITY),
        });
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.id !== id);
        return;
      }
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.quantity = Math.min(Math.floor(quantity), MAX_QUANTITY);
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartTotalQuantity = createSelector([selectCartItems], (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0),
);

export const selectCartTotalPrice = createSelector([selectCartItems], (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0),
);
