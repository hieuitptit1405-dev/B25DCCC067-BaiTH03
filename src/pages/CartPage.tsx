import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  MAX_QUANTITY,
  clearCart,
  removeFromCart,
  selectCartItems,
  selectCartTotalPrice,
  selectCartTotalQuantity,
  updateQuantity,
} from '../features/cart/cartSlice';
import { formatPrice } from '../utils/format';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const totalQuantity = useAppSelector(selectCartTotalQuantity);
  const totalPrice = useAppSelector(selectCartTotalPrice);

  if (items.length === 0) {
    return (
      <section className="empty">
        <h1>Giỏ hàng</h1>
        <p className="state">Giỏ hàng của bạn đang trống.</p>
        <Link to="/" className="btn btn--primary">
          Tiếp tục mua sắm
        </Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Giỏ hàng</h1>
      <div className="cart">
        <ul className="cart__list">
          {items.map((item) => (
            <li key={item.id} className="cart-item">
              <img className="cart-item__image" src={item.image} alt="" width={80} height={80} loading="lazy" />
              <div className="cart-item__info">
                <Link to={`/products/${item.id}`} className="cart-item__title">
                  {item.title}
                </Link>
                <span className="muted">{formatPrice(item.price)} / sản phẩm</span>
              </div>
              <div className="qty" role="group" aria-label={`Số lượng ${item.title}`}>
                <button
                  type="button"
                  className="btn btn--icon btn--sm"
                  onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                  aria-label="Giảm số lượng"
                >
                  −
                </button>
                <input
                  type="number"
                  className="input qty__input"
                  min={1}
                  max={MAX_QUANTITY}
                  value={item.quantity}
                  aria-label="Số lượng"
                  onChange={(e) => {
                    const value = e.target.valueAsNumber;
                    if (!Number.isNaN(value)) {
                      dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, value) }));
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn btn--icon btn--sm"
                  onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                  disabled={item.quantity >= MAX_QUANTITY}
                  aria-label="Tăng số lượng"
                >
                  +
                </button>
              </div>
              <strong className="cart-item__subtotal">{formatPrice(item.price * item.quantity)}</strong>
              <button
                type="button"
                className="btn btn--danger btn--sm"
                onClick={() => dispatch(removeFromCart(item.id))}
                aria-label={`Xoá ${item.title} khỏi giỏ`}
              >
                Xoá
              </button>
            </li>
          ))}
        </ul>

        <aside className="summary" aria-label="Tóm tắt đơn hàng">
          <h2>Tóm tắt</h2>
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
          <Link to="/checkout" className="btn btn--primary btn--block">
            Thanh toán
          </Link>
          <button type="button" className="btn btn--outline btn--block" onClick={() => dispatch(clearCart())}>
            Xoá giỏ hàng
          </button>
        </aside>
      </div>
    </section>
  );
}
