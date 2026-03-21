import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Settings, LogOut, Sun, Moon, Clock, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import "../../styles/Admin.css";
import { useLanguage } from "../../contexts/LanguageContext";

interface AdminLayoutProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const AdminLayout = ({ theme, toggleTheme }: AdminLayoutProps) => {
  const { t } = useLanguage();
  const [time, setTime] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="admin-layout">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={closeSidebar}></div>
      )}

      {/* Admin Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="admin-brand">
          <div className="admin-logo-placeholder">DS</div>
          <h3>{t.admin?.adminPanel || "Admin Panel"}</h3>
          <button className="admin-sidebar-close mobile-only" onClick={closeSidebar}>
            <X size={20} />
          </button>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end onClick={closeSidebar} className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            <span>{t.admin?.dashboard?.split(' ')[0] || "Dashboard"}</span>
          </NavLink>
          <NavLink to="/admin/users" onClick={closeSidebar} className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <Users size={20} />
            <span>{t.admin?.usersManagement?.split(' ')[0] || "Users"}</span>
          </NavLink>
          <NavLink to="/admin/settings" onClick={closeSidebar} className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <Settings size={20} />
            <span>{t.admin?.settings?.split(' ')[0] || "Settings"}</span>
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
          <div className="admin-topbar-left">
            <button className="admin-menu-toggle mobile-only" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <div className="admin-topbar-search desktop-only">
              <input type="text" placeholder={t.admin?.searchPlaceholder || "Search..."} className="admin-search-input" />
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div className="admin-clock desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-sub)', fontWeight: 500, fontFamily: "'Questrial', sans-serif" }}>
              <Clock size={16} />
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="admin-topbar-profile">
              <div className="admin-avatar">R</div>
              <span className="desktop-only">Rafiqul Islam</span>
            </div>
          </div>
        </header>

        <div className="admin-content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
