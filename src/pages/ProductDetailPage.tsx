import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addToCart } from '../features/cart/cartSlice';
import {
  fetchProducts,
  selectProductById,
  selectProductsError,
  selectProductsStatus,
} from '../features/products/productsSlice';
import { formatPrice } from '../utils/format';
import NotFoundPage from './NotFoundPage';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectProductsStatus);
  const error = useAppSelector(selectProductsError);
  const product = useAppSelector((state) => selectProductById(state, productId));
  const [added, setAdded] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 2000);
    return () => window.clearTimeout(timer);
  }, [added]);

  if (!Number.isInteger(productId)) return <NotFoundPage />;

  if (status === 'idle' || status === 'loading') {
    return (
      <p className="state" role="status">
        <span className="spinner" aria-hidden="true" /> Đang tải sản phẩm...
      </p>
    );
  }

  if (status === 'failed') {
    return (
      <div className="state state--error" role="alert">
        <p>Không tải được sản phẩm: {error}</p>
        <button type="button" className="btn btn--primary" onClick={() => dispatch(fetchProducts())}>
          Thử lại
        </button>
      </div>
    );
  }

  if (!product) return <NotFoundPage />;

  const handleAdd = () => {
    dispatch(addToCart({ product }));
    setAdded(true);
  };

  return (
    <article className="detail">
      <Link to="/" className="back-link">
        ← Quay lại danh sách
      </Link>
      <div className="detail__grid">
        <div className="detail__image-wrap">
          <img className="detail__image" src={product.image} alt={product.title} width={400} height={400} />
        </div>
        <div className="detail__info">
          <span className="card__category">{product.category}</span>
          <h1 className="detail__title">{product.title}</h1>
          <p className="price price--lg">{formatPrice(product.price)}</p>
          <p className="detail__desc">{product.description}</p>
          <div className="detail__actions">
            <button type="button" className="btn btn--primary btn--lg" onClick={handleAdd}>
              Thêm vào giỏ hàng
            </button>
            <Link to="/cart" className="btn btn--outline btn--lg">
              Xem giỏ hàng
            </Link>
          </div>
          <p className="toast-inline" role="status">
            {added ? '✓ Đã thêm vào giỏ hàng' : ''}
          </p>
        </div>
      </div>
    </article>
  );
}
