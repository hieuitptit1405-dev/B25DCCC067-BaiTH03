# ShopMini

Cửa hàng mini viết bằng **React 19 + TypeScript (Vite)**, quản lý state bằng **`useState`**, **Context API** và **Redux Toolkit**.

## Chạy dự án

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check (tsc -b) + build production
```

Đăng nhập: tên bất kỳ, mật khẩu **`123456`**.

## Tính năng

| Route | Mô tả |
| --- | --- |
| `/` | Lưới sản phẩm responsive (1 / 2 / 4 cột), tìm kiếm theo tên |
| `/products/:id` | Chi tiết sản phẩm, thêm vào giỏ |
| `/cart` | Tăng/giảm/sửa số lượng, xoá, xoá toàn bộ, tổng số lượng & tổng tiền |
| `/login` | Đăng nhập giả lập, xong quay lại trang trước đó |
| `/checkout` | **Protected route** – nút "Đặt hàng" xoá giỏ + báo thành công |
| `*` | Trang 404 |

## Phân bổ State (`useState`, Context API, Redux Toolkit) và Lý do

### 1. `useState` (Local UI State – Trạng thái cục bộ của từng component)
| Dữ liệu | Vị trí | Lý do đặt ở `useState` |
| --- | --- | --- |
| `search` (từ khoá tìm kiếm) | `src/pages/HomePage.tsx` | Chỉ dùng để lọc danh sách ngay trên Trang chủ, không có trang hay component bên ngoài nào cần đọc; khi rời trang có thể reset tự nhiên. |
| `added` (thông báo "Đã thêm vào giỏ") | `src/pages/ProductDetailPage.tsx` | Trạng thái phản hồi UI tạm thời (tự tắt sau 2 giây) của riêng nút bấm trên trang Chi tiết sản phẩm. |
| `username`, `password`, `error` | `src/pages/LoginPage.tsx` | Dữ liệu nháp người dùng đang gõ trên form và lỗi kiểm tra mật khẩu; chỉ khi đăng nhập hợp lệ mới đẩy `user` lên `AuthContext`. Đưa từng phím gõ lên global state sẽ gây re-render dư thừa. |
| `orderPlaced` (đã đặt hàng thành công) | `src/pages/CheckoutPage.tsx` | Chỉ quyết định việc chuyển giao diện sang màn hình cảm ơn ngay tại trang Thanh toán sau khi bấm "Đặt hàng". |

### 2. Context API (Global App Environment – Trạng thái toàn cục tần suất thay đổi thấp)
| Dữ liệu | Vị trí | Lý do đặt ở Context API |
| --- | --- | --- |
| `theme` (`'light' \| 'dark'`), `toggleTheme()` | `src/contexts/ThemeContext.tsx` (`useTheme`) | Giao diện sáng/tối áp dụng xuyên suốt toàn ứng dụng (Header, CSS hệ thống), nhưng ít thay đổi và logic đơn giản (chỉ đảo trạng thái + đồng bộ `<meta name="color-scheme">` & `localStorage`), không cần tới middleware hay async thunk của Redux. |
| `user` (`User \| null`), `login()`, `logout()` | `src/contexts/AuthContext.tsx` (`useAuth`) | Thông tin phiên đăng nhập cần truy cập ở nhiều nơi cách xa nhau trên cây component (`Header`, `ProtectedRoute`, `LoginPage`, `CheckoutPage`), nhưng chỉ thay đổi khi người dùng đăng nhập/đăng xuất. Context API giúp tránh *prop drilling* gọn nhẹ và đúng bản chất dữ liệu định danh phiên làm việc. |

### 3. Redux Toolkit (Global Domain / Server State – Dữ liệu nghiệp vụ phức tạp & bất đồng bộ)
| Dữ liệu | Vị trí | Lý do đặt ở Redux Toolkit |
| --- | --- | --- |
| `products` (`items`, `status`: `idle \| loading \| succeeded \| failed`, `error`) | `src/features/products/productsSlice.ts` | Dữ liệu lấy từ REST API (`fakestoreapi.com/products`) dùng chung giữa `HomePage` và `ProductDetailPage`. `createAsyncThunk` quản lý chuẩn xác vòng đời bất đồng bộ (`pending` / `fulfilled` / `rejected`), tránh gọi lại API không cần thiết (`condition`) khi chuyển qua lại giữa các trang. |
| `cart` (`items`: danh sách `CartItem` gồm số lượng) + selectors tổng số lượng, tổng tiền | `src/features/cart/cartSlice.ts` | Giỏ hàng được đọc và cập nhật từ rất nhiều nơi (`Header`, `ProductCard`, `ProductDetailPage`, `CartPage`, `CheckoutPage`) với nhiều nghiệp vụ biến đổi state (`addToCart` cộng dồn hoặc thêm mới, giới hạn tối đa, `updateQuantity`, `removeFromCart`, `clearCart`). Redux Toolkit cung cấp Immer giúp cập nhật bất biến an toàn, `createSelector` để tính toán ghi nhớ (memoize) tổng số lượng & tổng tiền hiệu quả, và dễ dàng lắng nghe qua `store.subscribe` để lưu `localStorage`. |

## Cấu trúc thư mục

```
src/
├── app/            store.ts (configureStore, RootState, AppDispatch), hooks.ts
├── features/
│   ├── products/   productsSlice.ts (createAsyncThunk: loading / succeeded / failed)
│   └── cart/       cartSlice.ts (add/remove/updateQuantity/clear + selectors), cartStorage.ts
├── contexts/       ThemeContext.tsx (useTheme), AuthContext.tsx (useAuth)
├── components/     Header, ProductCard, ProtectedRoute
├── layouts/        MainLayout
├── pages/          Home, ProductDetail, Cart, Login, Checkout, NotFound
├── types/          Product, CartItem, User, Theme, RequestStatus
├── utils/          format.ts (định dạng giá USD)
├── App.tsx         khai báo Routes
└── main.tsx        Provider → ThemeProvider → AuthProvider → BrowserRouter
```

Giỏ hàng, người dùng và theme được lưu vào `localStorage` nên không mất khi tải lại trang.
