import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, LogOut, Bell, Users, Menu, X as XIcon, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import "../../styles/Workspace.css";
import { useLanguage } from "../../contexts/LanguageContext";
import { supabase } from "../../utils/supabaseClient";

interface WorkspaceLayoutProps {
  // theme and toggleTheme reserved for future workspace theme support
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
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
    const fetchWorkspaceData = async () => {
      const loggedInId = localStorage.getItem("ds_logged_in_user");
      if (!loggedInId) {
        navigate("/");
        return;
      }

      // Fetch active user details (using the view)
      const { data: user, error: userError } = await supabase
        .from('user_details')
        .select('*')
        .eq('login_id', loggedInId)
        .single();

      if (userError || !user) {
        console.error("User not found:", userError);
        navigate("/");
        return;
      }

      const isAdminRole = (r: string) => {
        const lower = (r || '').toLowerCase();
        return lower.includes('admin') || lower.includes('owner') || lower.includes('founder') || lower.includes('system');
      };

      if (isAdminRole(user.role_name_en)) {
        navigate("/admin");
        return;
      }

      setActiveUser({
        id: user.login_id,
        name: user.name,
        roleEn: user.role_name_en,
        roleBn: user.role_name_bn,
        workspaceId: user.workspace_id,
        initial: user.name.charAt(0).toUpperCase()
      });

      // Fetch all users for the member list (only active ones)
      const { data: allUsers } = await supabase
        .from('user_details')
        .select('*')
        .eq('status', 'active');
      
      if (allUsers) {
        setUsers(allUsers.map((u: any) => ({
          id: u.login_id,
          name: u.name,
          roleEn: u.role_name_en,
          roleBn: u.role_name_bn,
          workspaceId: u.workspace_id,
          initial: u.name.charAt(0).toUpperCase()
        })));
      }

      // Fetch all active workspaces
      const { data: wsData } = await supabase
        .from('workspaces')
        .select('*')
        .eq('status', 'active');
      
      if (wsData) {
        setWorkspaces(wsData);
      }
    };

    fetchWorkspaceData();
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

        <div className="ws-content">
          <Outlet context={{ activeUser, users, workspaces, theme, toggleTheme }} />
        </div>
      </main>
    </div>
  );
};
