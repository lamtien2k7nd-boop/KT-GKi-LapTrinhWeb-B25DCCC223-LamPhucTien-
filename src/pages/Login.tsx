import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };
  const from = location.state?.from || '/';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (isAuthenticated) return <Navigate to="/" replace />;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ tài khoản và mật khẩu');
      return;
    }
    if (login(username.trim(), password)) {
      navigate(from, { replace: true });
    } else {
      setError('Sai tài khoản hoặc mật khẩu');
    }
  };

  return (
    <div className="form-box">
      <h1>Đăng nhập</h1>
      <form onSubmit={onSubmit}>
        <label>Tên đăng nhập</label>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Vui lòng nhập tên đăng nhập" />

        <label>Mật khẩu</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Vui lòng nhập mật khẩu"
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn">Đăng nhập</button>
      </form>
      <p className="hint">💡 Tài khoản mẫu: <b>admin</b> / <b>123456</b></p>
    </div>
  );
}