import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const { isAuthenticated, user, logout } = useAuth();
  return (
    <>
      <div className="site-shell">
        <header className="header">
          <Link to="/" className="logo">essos</Link>
          <nav className="nav" aria-label="Điều hướng chính">
            <a href="/#latest">Bài viết</a>
            <a href="/#founders">Góc sáng lập</a>
            {isAuthenticated && <NavLink to="/create">Viết bài</NavLink>}
          </nav>
          <div className="header-actions">
            {isAuthenticated ? (
              <>
                <span className="greet">{user}</span>
                <button onClick={logout} className="btn-outline">Đăng xuất</button>
              </>
            ) : (
              <>
                <Link to="/login" className="login-link">Đăng nhập <span aria-hidden="true">↗</span></Link>
                <Link to="/login" className="btn">Bắt đầu</Link>
              </>
            )}
          </div>
        </header>
        <main className="container">
          <Outlet />
        </main>
      </div>
    </>
  );
}