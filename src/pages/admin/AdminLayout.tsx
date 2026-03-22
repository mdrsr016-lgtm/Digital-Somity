import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Settings, LogOut, Sun, Moon, Clock, Menu, X, HelpCircle, Languages, ChevronDown, Snowflake, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/Admin.css";
import { useLanguage } from "../../contexts/LanguageContext";
import { MockUser } from "../../data/mockUsers";
import { api } from "../../services/api";

interface AdminLayoutProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const AdminLayout = ({ theme, toggleTheme }: AdminLayoutProps) => {
  const { t, setLanguage, language } = useLanguage();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isServerMenuOpen, setIsServerMenuOpen] = useState(true);
  const [activeUser, setActiveUser] = useState<MockUser | null>(null);

  const [users, setUsers] = useState<MockUser[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [workspaces, setWorkspaces] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, rolesData, workspacesData] = await Promise.all([
          api.getUsers(),
          api.getRoles(),
          api.getWorkspaces()
        ]);
        setUsers(usersData);
        setRoles(rolesData);
        setWorkspaces(workspacesData);

        const userId = localStorage.getItem("ds_logged_in_user");
        const foundUser = usersData.find((u: any) => u.id.toLowerCase() === userId?.toLowerCase());
        
        if (!foundUser || foundUser.roleEn !== 'System Administrator') {
          navigate(foundUser ? "/workspace" : "/");
        } else {
          setActiveUser(foundUser);
        }
      } catch (error) {
        console.error("Failed to fetch initial admin data", error);
      }
    };
    fetchData();
  }, [navigate]);

  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'err' } | null>(null);

  const showToast = (msg: string) => {
    setToast({ msg, type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const generateUserId = (role: string) => {
    let prefix = 'USR';
    const r = role.toLowerCase();
    if (r.includes('admin')) prefix = 'ADM';
    else if (r.includes('cashier')) prefix = 'CAS';
    else if (r.includes('member')) prefix = 'MEM';
    else if (r.includes('manager') || r.includes('invest')) prefix = 'INV';
    
    const count = users.filter((u: MockUser) => {
      const ur = u.roleEn.toLowerCase();
      if (prefix === 'ADM') return ur.includes('admin');
      if (prefix === 'CAS') return ur.includes('cashier');
      if (prefix === 'MEM') return ur.includes('member');
      return ur.includes('manager') || ur.includes('invest');
    }).length;

    const nextNumber = (count + 1).toString().padStart(3, '0');
    return `${prefix}${nextNumber}`;
  };

  const updateStatus = async (userId: string, status: MockUser['status']) => {
    try {
      await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
    } catch (e) { console.error(e); }
  };

  const deleteUser = async (userId: string) => {
    try {
      await api.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (e) { console.error(e); }
  };

  const updateRoleStatus = async (roleId: string, status: 'active' | 'archived') => {
    try {
      await fetch(`http://localhost:3001/roles/${roleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      setRoles(prev => prev.map(r => r.id === roleId ? { ...r, status } : r));
    } catch (e) { console.error(e); }
  };

  const handleLogout = () => {
    localStorage.removeItem("ds_logged_in_user");
    navigate("/");
  };

  const deleteRolePermanently = async (roleId: string) => {
    try {
      await api.deleteRole(roleId);
      setRoles(prev => prev.filter(r => r.id !== roleId));
    } catch (e) { console.error(e); }
  };

  const updateWorkspaceStatus = async (wsId: string, status: 'active' | 'archived') => {
    try {
      await fetch(`http://localhost:3001/workspaces/${wsId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      setWorkspaces(prev => prev.map(w => w.id === wsId ? { ...w, status } : w));
    } catch (e) { console.error(e); }
  };

  const deleteWorkspacePermanently = async (wsId: string) => {
    try {
      await api.deleteWorkspace(wsId);
      setWorkspaces(prev => prev.filter(w => w.id !== wsId));
    } catch (e) { console.error(e); }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="admin-layout">
      <div className="admin-bg-glow" />
      <div className="admin-bg-glow-bottom" />
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
            <div 
              className="admin-nav-group-label" 
              onClick={() => setIsServerMenuOpen(!isServerMenuOpen)}
              style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Users size={16} />
                <span>{t.admin?.usersLabel || "Server"}</span>
              </div>
              <ChevronDown 
                size={16} 
                style={{ 
                  transform: isServerMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
                  transition: 'transform 0.3s ease' 
                }} 
              />
            </div>
            <AnimatePresence initial={false}>
              {isServerMenuOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                  animate={{ height: 'auto', opacity: 1, marginBottom: 0 }}
                  exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="admin-sub-nav">
                    <NavLink to="/admin/workspaces" onClick={closeSidebar} className={({ isActive }) => `admin-sub-nav-item ${isActive ? 'active' : ''}`}>
                      {t.admin?.workspaceList || "Workspace Manager"}
                    </NavLink>
                    <NavLink to="/admin/users" end onClick={closeSidebar} className={({ isActive }) => `admin-sub-nav-item ${isActive ? 'active' : ''}`}>
                      {t.admin?.userList || "User List"}
                    </NavLink>
                    <NavLink to="/admin/roles" onClick={closeSidebar} className={({ isActive }) => `admin-sub-nav-item ${isActive ? 'active' : ''}`}>
                      {t.admin?.userRoles || "User Roles"}
                    </NavLink>
                    <NavLink to="/admin/fridge" onClick={closeSidebar} className={({ isActive }) => `admin-sub-nav-item ${isActive ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Snowflake size={14} style={{ opacity: 0.7 }} />
                      {t.admin?.userFridge || "Fridge"}
                    </NavLink>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink to="/admin/settings" onClick={closeSidebar} className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <Settings size={20} />
            <span>{t.admin?.settingsLabel || "Settings"}</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-nav-item logout-item" onClick={handleLogout} style={{ border: 'none', background: 'none', width: '100%', cursor: 'pointer' }}>
            <LogOut size={20} />
            <span>{language === 'bn' ? 'লগ আউট' : 'Log Out'}</span>
          </button>
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
              <div className="admin-avatar">{activeUser?.initial || 'A'}</div>
              <span className="desktop-only text-truncate" style={{ maxWidth: '100px' }}>{activeUser?.name || 'Admin'}</span>
            </div>

            <NavLink to="/" className="topbar-exit-btn" title="Exit Admin">
              <LogOut size={20} />
            </NavLink>
          </div>
        </header>

        <div className="admin-content-wrapper">
          <Outlet context={{ 
            activeUser, users, setUsers, updateStatus, deleteUser, generateUserId, showToast,
            roles, setRoles, updateRoleStatus, deleteRolePermanently,
            workspaces, setWorkspaces, updateWorkspaceStatus, deleteWorkspacePermanently
          }} />
        </div>
      </main>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 2000,
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              padding: '16px 24px',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              minWidth: '300px'
            }}
          >
            <div style={{ color: '#10b981', display: 'flex' }}>
              <CheckCircle size={20} />
            </div>
            <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 500 }}>
              {toast.msg}
            </p>
            <button 
              onClick={() => setToast(null)}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-sub)', cursor: 'pointer', display: 'flex' }}
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
