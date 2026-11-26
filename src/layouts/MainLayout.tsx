import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

export default function MainLayout() {
  return (
    <div className="layout">
      <Header />
      <main className="container main">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container">© {new Date().getFullYear()} ShopMini · Dữ liệu từ Fake Store API</div>
      </footer>
    </div>
  );
}
