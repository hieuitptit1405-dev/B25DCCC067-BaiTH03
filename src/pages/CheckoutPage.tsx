import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  clearCart,
  selectCartItems,
  selectCartTotalPrice,
  selectCartTotalQuantity,
} from '../features/cart/cartSlice';
import { useAuth } from '../contexts/AuthContext';
import { formatPrice } from '../utils/format';

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const items = useAppSelector(selectCartItems);
  const totalQuantity = useAppSelector(selectCartTotalQuantity);
  const totalPrice = useAppSelector(selectCartTotalPrice);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(clearCart());
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <section className="success" role="status">
        <div className="success__icon" aria-hidden="true">
          ✓
        </div>
        <h1>Đặt hàng thành công!</h1>
        <p>Cảm ơn {user?.username}, đơn hàng của bạn đã được ghi nhận.</p>
        <Link to="/" className="btn btn--primary">
          Tiếp tục mua sắm
        </Link>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="empty">
        <h1>Thanh toán</h1>
        <p className="state">Giỏ hàng trống, chưa có gì để thanh toán.</p>
        <Link to="/" className="btn btn--primary">
          Về trang chủ
        </Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Thanh toán</h1>
      <div className="cart">
        <form id="checkout-form" className="checkout-form" onSubmit={handleSubmit}>
          <h2>Thông tin giao hàng</h2>
          <div className="field">
            <label htmlFor="fullName">Họ và tên</label>
            <input
              id="fullName"
              name="fullName"
              className="input"
              autoComplete="name"
              defaultValue={user?.username}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="phone">Số điện thoại</label>
            <input id="phone" name="phone" type="tel" className="input" autoComplete="tel" required />
          </div>
          <div className="field">
            <label htmlFor="address">Địa chỉ</label>
            <textarea
              id="address"
              name="address"
              className="input"
              rows={3}
              autoComplete="street-address"
              required
            />
          </div>
        </form>

        <aside className="summary" aria-label="Tóm tắt đơn hàng">
          <h2>Đơn hàng</h2>
          <ul className="summary__items">
            {items.map((item) => (
              <li key={item.id}>
                <span className="summary__item-title">
                  {item.title} × {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="summary__rows">
            <div>
              <dt>Tổng số lượng</dt>
              <dd>{totalQuantity}</dd>
            </div>
            <div className="summary__total">
              <dt>Tổng tiền</dt>
              <dd>{formatPrice(totalPrice)}</dd>
            </div>
          </dl>
          <button type="submit" form="checkout-form" className="btn btn--primary btn--block btn--lg">
            Đặt hàng
          </button>
        </aside>
      </div>
    </section>
  );
}
