import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import type { RedirectState } from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';

function isRedirectState(state: unknown): state is RedirectState {
  return (
    typeof state === 'object' &&
    state !== null &&
    'from' in state &&
    typeof state.from === 'string' &&
    state.from.startsWith('/')
  );
}

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const redirectTo = isRedirectState(location.state) ? location.state.from : '/';

  // Đã đăng nhập rồi thì không cần ở trang login
  if (user) return <Navigate to={redirectTo} replace />;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Vui lòng nhập tên đăng nhập.');
      return;
    }
    if (login(username, password)) {
      navigate(redirectTo, { replace: true });
    } else {
      setError('Sai mật khẩu. Vui lòng thử lại.');
    }
  };

  return (
    <section className="auth">
      <form className="auth__card" onSubmit={handleSubmit} noValidate>
        <h1>Đăng nhập</h1>
        {redirectTo !== '/' && <p className="muted">Bạn cần đăng nhập để tiếp tục.</p>}

        <div className="field">
          <label htmlFor="username">Tên đăng nhập</label>
          <input
            id="username"
            name="username"
            className="input"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="password">Mật khẩu</label>
          <input
            id="password"
            name="password"
            type="password"
            className="input"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-describedby="password-hint"
            required
          />
          <small id="password-hint" className="muted">
            Gợi ý: mật khẩu là <code>123456</code>
          </small>
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn btn--primary btn--block btn--lg">
          Đăng nhập
        </button>
      </form>
    </section>
  );
}
