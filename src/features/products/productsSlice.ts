import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { Product, RequestStatus } from '../../types';

const API_URL = 'https://fakestoreapi.com/products';

interface ProductsState {
  items: Product[];
  status: RequestStatus;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
};

function isProduct(value: unknown): value is Product {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'number' &&
    typeof v.title === 'string' &&
    typeof v.price === 'number' &&
    typeof v.description === 'string' &&
    typeof v.category === 'string' &&
    typeof v.image === 'string'
  );
}

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { state: RootState; rejectValue: string }
>(
  'products/fetchProducts',
  async (_, { rejectWithValue, signal }) => {
    try {
      const response = await fetch(API_URL, { signal });
      if (!response.ok) {
        return rejectWithValue(`Máy chủ trả về lỗi ${response.status}`);
      }
      const data: unknown = await response.json();
      if (!Array.isArray(data)) {
        return rejectWithValue('Dữ liệu sản phẩm không hợp lệ');
      }
      return data.filter(isProduct).map(({ id, title, price, description, category, image }) => ({
        id,
        title,
        price,
        description,
        category,
        image,
      }));
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Không thể tải sản phẩm');
    }
  },
  {
    condition: (_, { getState }) => {
      const { status } = getState().products;
      return status !== 'loading' && status !== 'succeeded';
    },
  },
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Đã có lỗi xảy ra';
      });
  },
});

export default productsSlice.reducer;

// Selectors
export const selectAllProducts = (state: RootState) => state.products.items;
export const selectProductsStatus = (state: RootState) => state.products.status;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectProductById = (state: RootState, id: number) =>
  state.products.items.find((p) => p.id === id);
