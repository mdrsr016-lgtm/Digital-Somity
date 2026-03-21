import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Settings, LogOut, Sun, Moon } from "lucide-react";
import "../../styles/Admin.css";
import { useLanguage } from "../../contexts/LanguageContext";

interface AdminLayoutProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const AdminLayout = ({ theme, toggleTheme }: AdminLayoutProps) => {
  const { t } = useLanguage();

  return (
    <div className="admin-layout">
      {/* Admin Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-logo-placeholder">DS</div>
          <h3>Admin Panel</h3>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <Users size={20} />
            <span>Users</span>
          </NavLink>
          <NavLink to="/admin/settings" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-nav-item" onClick={toggleTheme}>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            <span>{theme === 'light' ? t.sidebar.darkMode : t.sidebar.lightMode}</span>
          </button>
          
          <NavLink to="/" className="admin-nav-item logout">
            <LogOut size={20} />
            <span>Exit Admin</span>
          </NavLink>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-content">
        <header className="admin-topbar">
          <div className="admin-topbar-search">
            <input type="text" placeholder="Search..." className="admin-search-input" />
          </div>
          <div className="admin-topbar-profile">
            <div className="admin-avatar">A</div>
            <span>Admin User</span>
          </div>
        </header>

        <div className="admin-content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
