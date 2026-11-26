import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import ProductCard from '../components/ProductCard';
import {
  fetchProducts,
  selectAllProducts,
  selectProductsError,
  selectProductsStatus,
} from '../features/products/productsSlice';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectAllProducts);
  const status = useAppSelector(selectProductsStatus);
  const error = useAppSelector(selectProductsError);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return products;
    return products.filter((p) => p.title.toLowerCase().includes(keyword));
  }, [products, search]);

  return (
    <section>
      <div className="page-head">
        <h1>Sản phẩm</h1>
        <div className="search">
          <label htmlFor="search" className="visually-hidden">
            Tìm sản phẩm theo tên
          </label>
          <input
            id="search"
            type="search"
            className="input"
            placeholder="🔍 Tìm theo tên sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
          />
        </div>
      </div>

      {status === 'loading' && (
        <p className="state" role="status">
          <span className="spinner" aria-hidden="true" /> Đang tải sản phẩm...
        </p>
      )}

      {status === 'failed' && (
        <div className="state state--error" role="alert">
          <p>Không tải được sản phẩm: {error}</p>
          <button type="button" className="btn btn--primary" onClick={() => dispatch(fetchProducts())}>
            Thử lại
          </button>
        </div>
      )}

      {status === 'succeeded' && (
        <>
          <p className="muted" aria-live="polite">
            {search.trim()
              ? `Tìm thấy ${filteredProducts.length} sản phẩm cho "${search.trim()}"`
              : `${products.length} sản phẩm`}
          </p>
          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="state">Không có sản phẩm nào phù hợp.</p>
          )}
        </>
      )}
    </section>
  );
}
