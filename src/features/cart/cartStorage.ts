import type { CartItem } from '../../types';
import type { CartState } from './cartSlice';

const CART_KEY = 'shopmini-cart';

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'number' &&
    typeof v.title === 'string' &&
    typeof v.price === 'number' &&
    typeof v.image === 'string' &&
    typeof v.quantity === 'number' &&
    v.quantity > 0
  );
}

export function loadCartState(): CartState | undefined {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return undefined;
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every(isCartItem)) {
      return { items: parsed };
    }
  } catch {
  }
  return undefined;
}

export function saveCartState(state: CartState): void {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(state.items));
  } catch {
  }
}
