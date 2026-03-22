import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, LogOut, Bell, Users, Menu, X as XIcon, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import "../../styles/Workspace.css";
import { useLanguage } from "../../contexts/LanguageContext";
import { api } from "../../services/api";

interface WorkspaceLayoutProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const WorkspaceLayout = ({ theme, toggleTheme }: WorkspaceLayoutProps) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeUser, setActiveUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, workspacesData] = await Promise.all([
          api.getUsers(),
          api.getWorkspaces()
        ]);
        
        setUsers(usersData);
        setWorkspaces(workspacesData);

        const userId = localStorage.getItem("ds_logged_in_user");
        const user = usersData.find((u: any) => u.id.toLowerCase() === userId?.toLowerCase());
        
        if (!user) {
          navigate("/");
        } else {
          setActiveUser(user);
        }
      } catch (error) {
        console.error("Failed to fetch workspace data", error);
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("ds_logged_in_user");
    navigate("/");
  };

  return (
    <div className="workspace-layout">
      <div className="ws-bg-glow" />
      <div className="ws-bg-glow-bottom" />

      {/* Sidebar - Premium Design */}
      <aside className={`workspace-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="ws-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
            <div className="ws-logo">DS</div>
            <span className="ws-brand-name">Digital Somiti</span>
          </div>
          <button 
            className="ws-mobile-close" 
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ display: 'none' }} // Visible only in CSS media query
          >
            <XIcon size={24} />
          </button>
        </div>

        <nav className="ws-nav">
          <NavLink to="/workspace" end className={({ isActive }) => `ws-nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            <span>{language === 'bn' ? 'ওভারভিউ' : 'Overview'}</span>
          </NavLink>
          <NavLink to="/workspace/notifications" className={({ isActive }) => `ws-nav-item ${isActive ? 'active' : ''}`}>
            <Bell size={20} />
            <span>{language === 'bn' ? 'নোটিফিকেশন' : 'Notifications'}</span>
          </NavLink>
          <NavLink to="/workspace/members" className={({ isActive }) => `ws-nav-item ${isActive ? 'active' : ''}`}>
            <Users size={20} />
            <span>{language === 'bn' ? 'সদস্য তালিকা' : 'Members Database'}</span>
          </NavLink>
          <NavLink to="/workspace/settings" className={({ isActive }) => `ws-nav-item ${isActive ? 'active' : ''}`}>
            <Settings size={20} />
            <span>{language === 'bn' ? 'সেটিংস' : 'Settings'}</span>
          </NavLink>
        </nav>

        <div className="ws-user-widget">
          <div 
            className="ws-user-info" 
            onClick={() => navigate('/workspace/profile')}
            style={{ cursor: 'pointer' }}
          >
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

      {/* Overlay for mobile sidebar */}
      {isMobileMenuOpen && (
        <div 
          className="ws-sidebar-overlay" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="workspace-main">
        <header className="workspace-topbar">
          <div className="ws-topbar-left">
            <button 
              className="ws-mobile-menu-btn" 
              onClick={() => setIsMobileMenuOpen(true)}
              style={{ display: 'none', background: 'none', border: 'none', color: 'var(--ws-text)', cursor: 'pointer', marginRight: '1rem' }}
            >
              <Menu size={24} />
            </button>
            <div className="ws-header-brand">
              <span className="ws-header-dot"></span>
              {
                workspaces.find(w => w.id === activeUser?.workspaceId)?.name || 'General Workspace'
              }
            </div>
          </div>
          
          <div className="ws-topbar-right">
            <div className="ws-topbar-actions">
              <button className="topbar-btn">
                <Bell size={20} />
                <span className="ws-notification-dot"></span>
              </button>
            </div>
          </div>
        </header>

        <div className="ws-overview">
          <Outlet context={{ activeUser, users, workspaces, theme, toggleTheme }} />
        </div>
      </main>
    </div>
  );
};
