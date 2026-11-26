import { Link } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { addToCart } from '../features/cart/cartSlice';
import type { Product } from '../types';
import { formatPrice } from '../utils/format';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const detailUrl = `/products/${product.id}`;

  return (
    <article className="card">
      <Link to={detailUrl} className="card__image-link" tabIndex={-1} aria-hidden="true">
        <img
          className="card__image"
          src={product.image}
          alt=""
          width={200}
          height={200}
          loading="lazy"
          decoding="async"
        />
      </Link>
      <div className="card__body">
        <span className="card__category">{product.category}</span>
        <h2 className="card__title">
          <Link to={detailUrl}>{product.title}</Link>
        </h2>
        <div className="card__footer">
          <span className="price">{formatPrice(product.price)}</span>
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => dispatch(addToCart({ product }))}
            aria-label={`Thêm "${product.title}" vào giỏ`}
          >
            + Giỏ hàng
          </button>
        </div>
      </div>
    </article>
  );
}
