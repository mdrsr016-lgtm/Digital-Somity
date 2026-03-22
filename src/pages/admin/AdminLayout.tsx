import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Settings, LogOut, Sun, Moon, Clock, Menu, X, HelpCircle, Languages } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/Admin.css";
import { useLanguage } from "../../contexts/LanguageContext";

interface AdminLayoutProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const AdminLayout = ({ theme, toggleTheme }: AdminLayoutProps) => {
  const { t, setLanguage } = useLanguage();
  const [time, setTime] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

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
            <span>{t.admin?.dashboardLabel || "Dashboard"}</span>
          </NavLink>

          <div className="admin-nav-group">
            <div className="admin-nav-group-label">
              <Users size={16} />
              <span>{t.admin?.usersLabel || "Server Users"}</span>
            </div>
            <div className="admin-sub-nav">
              <NavLink to="/admin/users" end onClick={closeSidebar} className={({ isActive }) => `admin-sub-nav-item ${isActive ? 'active' : ''}`}>
                {t.admin?.userList || "User List"}
              </NavLink>
              <NavLink to="/admin/roles" onClick={closeSidebar} className={({ isActive }) => `admin-sub-nav-item ${isActive ? 'active' : ''}`}>
                {t.admin?.userRoles || "User Roles"}
              </NavLink>
            </div>
          </div>

          <NavLink to="/admin/settings" onClick={closeSidebar} className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <Settings size={20} />
            <span>{t.admin?.settingsLabel || "Settings"}</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-footer-copyright">
            &copy; 2026 Digital Somiti
          </div>
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
          
          <div className="admin-topbar-right">
            <div className="admin-clock desktop-only">
              <Clock size={16} />
              <span>
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                <span style={{ opacity: 0.5, margin: '0 8px' }}>•</span>
                {time.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <div className="admin-topbar-actions">
              <button className="topbar-btn" title={t.sidebar.help}>
                <HelpCircle size={20} />
              </button>

              <div className="topbar-lang-container">
                <button 
                  className={`topbar-btn ${isLangOpen ? 'active' : ''}`}
                  onClick={() => setIsLangOpen(!isLangOpen)}
                >
                  <Languages size={20} />
                </button>
                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="topbar-lang-dropdown"
                    >
                      <button className="lang-option" onClick={() => { setLanguage('en'); setIsLangOpen(false); }}>
                        <div className="flag us-flag" />
                        <span>English</span>
                      </button>
                      <button className="lang-option" onClick={() => { setLanguage('bn'); setIsLangOpen(false); }}>
                        <div className="flag bd-flag" />
                        <span>বাংলা</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button className="topbar-btn" onClick={toggleTheme}>
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            </div>

            <div className="admin-topbar-profile">
              <div className="admin-avatar">R</div>
              <span className="desktop-only text-truncate" style={{ maxWidth: '100px' }}>Rafiqul Islam</span>
            </div>

            <NavLink to="/" className="topbar-exit-btn" title="Exit Admin">
              <LogOut size={20} />
            </NavLink>
          </div>
        </header>

        <div className="admin-content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
