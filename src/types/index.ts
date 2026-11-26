/** Sản phẩm lấy từ https://fakestoreapi.com/products */
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export interface CartItem extends Pick<Product, 'id' | 'title' | 'price' | 'image'> {
  quantity: number;
}

export interface User {
  username: string;
}

export type Theme = 'light' | 'dark';
export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
