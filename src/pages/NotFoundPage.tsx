import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="not-found">
      <p className="not-found__code">404</p>
      <h1>Không tìm thấy trang</h1>
      <p className="muted">Trang hoặc sản phẩm bạn tìm không tồn tại.</p>
      <Link to="/" className="btn btn--primary">
        Về trang chủ
      </Link>
    </section>
  );
}
