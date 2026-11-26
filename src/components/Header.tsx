import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectCartTotalQuantity } from '../features/cart/cartSlice';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Header() {
  const totalQuantity = useAppSelector(selectCartTotalQuantity);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const nextThemeLabel = theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối';

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="header__logo">
          🛍️ <span>ShopMini</span>
        </Link>

        <nav className="header__nav" aria-label="Điều hướng chính">
          <NavLink to="/" end className="header__link">
            Trang chủ
          </NavLink>
          <NavLink to="/cart" className="header__link header__cart">
            Giỏ hàng
            <span className="badge" aria-label={`${totalQuantity} sản phẩm trong giỏ`}>
              {totalQuantity}
            </span>
          </NavLink>
        </nav>

        <div className="header__actions">
          <button
            type="button"
            className="btn btn--icon"
            onClick={toggleTheme}
            aria-label={nextThemeLabel}
            title={nextThemeLabel}
          >
            <span aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>
          </button>

          {user ? (
            <>
              <span className="header__user" title={user.username}>
                👤 {user.username}
              </span>
              <button type="button" className="btn btn--outline" onClick={handleLogout}>
                Đăng xuất
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn--primary">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
