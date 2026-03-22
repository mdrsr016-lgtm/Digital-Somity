import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, User, LogOut, Sun, Moon, Languages, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/Workspace.css";
import { useLanguage } from "../../contexts/LanguageContext";
import { mockUsers } from "../../data/mockUsers";

interface WorkspaceLayoutProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const WorkspaceLayout = ({ theme, toggleTheme }: WorkspaceLayoutProps) => {
  const { setLanguage, language } = useLanguage();
  const navigate = useNavigate();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<any>(null);

  useEffect(() => {
    const userId = localStorage.getItem("ds_logged_in_user");
    const user = mockUsers.find(u => u.id === userId);
    if (!user || user.roleEn === 'System Administrator') {
      setActiveUser(user || mockUsers[1]);
    } else {
      setActiveUser(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("ds_logged_in_user");
    navigate("/");
  };

  return (
    <div className="workspace-layout">
      <div className="ws-bg-glow" />
      <div className="ws-bg-glow-bottom" />

      {/* Sidebar - Premium Design */}
      <aside className="workspace-sidebar">
        <div className="ws-brand">
          <div className="ws-logo">DS</div>
          <span className="ws-brand-name">Digital Somiti</span>
        </div>

        <nav className="ws-nav">
          <NavLink to="/workspace" end className={({ isActive }) => `ws-nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            <span>{language === 'bn' ? 'ওভারভিউ' : 'Overview'}</span>
          </NavLink>
          <NavLink to="/workspace/profile" className={({ isActive }) => `ws-nav-item ${isActive ? 'active' : ''}`}>
            <User size={20} />
            <span>{language === 'bn' ? 'আমার প্রোফাইল' : 'My Profile'}</span>
          </NavLink>
          <NavLink to="/workspace/notifications" className={({ isActive }) => `ws-nav-item ${isActive ? 'active' : ''}`}>
            <Bell size={20} />
            <span>{language === 'bn' ? 'নোটিফিকেশন' : 'Notifications'}</span>
          </NavLink>
        </nav>

        <div className="ws-user-widget">
          <div className="ws-user-info">
            <div className="ws-user-avatar">{activeUser?.initial}</div>
            <div className="ws-user-text">
              <h4>{activeUser?.name}</h4>
              <p>{language === 'bn' ? activeUser?.roleBn : activeUser?.roleEn}</p>
            </div>
          </div>
          <button className="ws-logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            <span>{language === 'bn' ? 'লগ আউট' : 'Log Out'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="workspace-main">
        <header className="workspace-topbar">
          <div className="ws-topbar-left">
            <div className="ws-badge">
              <span className="ws-badge-dot"></span>
              {activeUser?.workspaceId === '2' ? 'Dhaka North' : (activeUser?.workspaceId === '3' ? 'Sylhet Regional' : 'General Workspace')}
            </div>
          </div>
          
          <div className="ws-topbar-right">
            <div className="ws-topbar-actions">
              <button className="topbar-btn" onClick={toggleTheme}>
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
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
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="topbar-lang-dropdown"
                    >
                      <button className="lang-option" onClick={() => { setLanguage('en'); setIsLangOpen(false); }}>
                        <span>English</span>
                      </button>
                      <button className="lang-option" onClick={() => { setLanguage('bn'); setIsLangOpen(false); }}>
                        <span>বাংলা</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <div className="ws-overview">
          <Outlet context={{ activeUser }} />
        </div>
      </main>
    </div>
  );
};
