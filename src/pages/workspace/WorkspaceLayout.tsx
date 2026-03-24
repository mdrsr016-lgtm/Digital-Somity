import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, LogOut, Bell, Users, Wallet, Menu, X, MessageCircle, Briefcase, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import "../../styles/Workspace.css";
import { useLanguage } from "../../contexts/LanguageContext";
import { supabase } from "../../utils/supabaseClient";
import { FridgedScreen } from "../../components/workspace/FridgedScreen";

export const WorkspaceLayout = ({ theme, toggleTheme }: { theme: 'light' | 'dark', toggleTheme: () => void }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeUser, setActiveUser] = useState<any>(null);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [fridgedState, setFridgedState] = useState<{ isFridged: boolean, type: 'user' | 'workspace' | 'role' }>({ 
    isFridged: false, 
    type: 'user' 
  });

  const RESTRICTED_STATUSES = ['fridge', 'removed', 'suspended', 'disabled'];

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const swipeRoutes = ["/workspace", "/workspace/members", "/workspace/settings", "/workspace/details", "/workspace/menu"];

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;
    const threshold = 80;

    if (Math.abs(diffX) > threshold) {
      const currentIndex = swipeRoutes.indexOf(location.pathname === "/workspace/" ? "/workspace" : location.pathname);
      if (currentIndex === -1) return;

      if (diffX > 0 && currentIndex < swipeRoutes.length - 1) {
        // Swipe Left -> Next
        navigate(swipeRoutes[currentIndex + 1]);
      } else if (diffX < 0 && currentIndex > 0) {
        // Swipe Right -> Previous
        navigate(swipeRoutes[currentIndex - 1]);
      }
    }
    setTouchStartX(null);
  };

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

      // 1. Fetch user details from view (Used for UI display)
      const { data: user, error: userError } = await supabase
        .from('user_details')
        .select('*')
        .eq('login_id', loggedInId)
        .single();

      // 2. Fetch direct user status (Most reliable)
      const { data: userData } = await supabase
        .from('users')
        .select('status, role_id, workspace_id')
        .eq('login_id', loggedInId)
        .single();

      if (user || !userError) {
        // --- COMPREHENSIVE STATUS CHECK ---
        const userStatusLC = (userData?.status || user?.status || '').toLowerCase();
        const roleStatusLC = (user.role_status || '').toLowerCase();
        
        console.log("FRIDGE DEBUG: [UserStatus]:", userStatusLC, "[RoleStatus]:", roleStatusLC);

        if (RESTRICTED_STATUSES.includes(userStatusLC)) {
          return setFridgedState({ isFridged: true, type: 'user' });
        } else if (RESTRICTED_STATUSES.includes(roleStatusLC)) {
          return setFridgedState({ isFridged: true, type: 'role' });
        } else {
          // If user/role is okay, Check Workspace
          const wsId = userData?.workspace_id || user?.workspace_id;
          if (wsId) {
            const { data: currentWs } = await supabase
              .from('workspaces')
              .select('status')
              .eq('id', wsId)
              .single();

            const wsStatusLC = currentWs?.status?.toLowerCase() || '';
            console.log("FRIDGE DEBUG: [WorkspaceStatus]:", wsStatusLC);
            if (RESTRICTED_STATUSES.includes(wsStatusLC)) {
              return setFridgedState({ isFridged: true, type: 'workspace' });
            } else {
              setFridgedState(prev => ({ ...prev, isFridged: false }));
            }
          } else {
            setFridgedState(prev => ({ ...prev, isFridged: false }));
          }
        }

        setActiveUser({
          id: user.login_id,
          name: user.name,
          roleEn: user.role_name_en,
          roleBn: user.role_name_bn,
          workspaceId: user.workspace_id,
          initial: user.name.charAt(0).toUpperCase()
        });
      }

      // Fetch all active workspaces for general navigation
      const { data: wsData } = await supabase
        .from('workspaces')
        .select('*')
        .eq('status', 'active');
      
      if (wsData) {
        setWorkspaces(wsData);
      }
    };

    fetchWorkspaceData();

    // Real-time: Multi-table subscription
    const workspaceChannel = supabase.channel('workspace-realtime-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'workspaces' }, (payload: any) => {
        console.log('Real-time Workspace RECEIVED:', payload);
        fetchWorkspaceData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload: any) => {
        console.log('Real-time User RECEIVED:', payload);
        fetchWorkspaceData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'roles' }, (payload: any) => {
        console.log('Real-time Role RECEIVED:', payload);
        fetchWorkspaceData();
      })
      .subscribe((status: string, err: any) => {
        console.log('Workspace realtime status:', status);
        if (err) console.error('Workspace realtime error:', err);
      });

    return () => {
      supabase.removeChannel(workspaceChannel);
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("ds_logged_in_user");
    navigate("/");
  };

  const activeWorkspaceName = workspaces.find(w => w.id === activeUser?.workspaceId)?.name || 'General Workspace';

  if (fridgedState.isFridged) {
    return <FridgedScreen onLogout={handleLogout} type={fridgedState.type} />;
  }

  return (
    <div className="workspace-layout">
      {/* Premium Sidebar */}
      <aside className={`workspace-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="ws-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
            <div className="ws-logo-container">
              <Wallet size={28} />
            </div>
            <div className="ws-brand-name">
              <span className="digital">Digital</span>
              <span className="somiti">Somiti</span>
            </div>
          </div>
          <button 
            className="ws-mobile-close" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="ws-nav">
          <NavLink to="/workspace" end className={({ isActive }) => `ws-nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={22} />
            <span>{language === 'bn' ? 'ওভারভিউ' : 'Overview'}</span>
          </NavLink>
          <NavLink to="/workspace/members" className={({ isActive }) => `ws-nav-item ${isActive ? 'active' : ''}`}>
            <Users size={22} />
            <span>{language === 'bn' ? 'সদস্য তালিকা' : 'Members Database'}</span>
          </NavLink>
          <NavLink to="/workspace/settings" className={({ isActive }) => `ws-nav-item ${isActive ? 'active' : ''}`}>
            <UserPlus size={22} />
            <span>{language === 'bn' ? 'সদস্য যোগ' : 'Add Member'}</span>
          </NavLink>
          <NavLink to="/workspace/details" className={({ isActive }) => `ws-nav-item ${isActive ? 'active' : ''}`}>
            <Briefcase size={22} />
            <span>{language === 'bn' ? 'ওয়ার্কস্পেস' : 'Workspace'}</span>
          </NavLink>
          <NavLink to="/workspace/notifications" className={({ isActive }) => `ws-nav-item ${isActive ? 'active' : ''}`}>
            <Bell size={22} />
            <span>{language === 'bn' ? 'নোটিফিকেশন' : 'Notifications'}</span>
          </NavLink>
        </nav>

        {/* User Card */}
        <div className="ws-user-widget">
          <div className="ws-user-info">
            <div className="ws-avatar">{activeUser?.initial}</div>
            <div className="ws-user-text">
              <h4>{activeUser?.name}</h4>
              <p>{language === 'bn' ? activeUser?.roleBn : activeUser?.roleEn}</p>
            </div>
          </div>
          <button className="ws-logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
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
      <main className="workspace-main" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <header className="workspace-topbar">
          <div className="ws-topbar-left">
            <div className="ws-workspace-badge">
              <span className="ws-workspace-name">
                <span className="ws-name-first">{activeWorkspaceName.split(' ')[0]}</span>
                {activeWorkspaceName.includes(' ') && (
                  <span className="ws-name-rest">{' ' + activeWorkspaceName.split(' ').slice(1).join(' ')}</span>
                )}
              </span>
            </div>
          </div>
          <div className="ws-topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <NavLink to="/workspace/messages" className={({ isActive }) => `topbar-btn ${isActive ? 'active' : ''}`}>
              <MessageCircle size={20} />
            </NavLink>
            <NavLink to="/workspace/notifications" className={({ isActive }) => `topbar-btn ${isActive ? 'active' : ''}`}>
              <Bell size={20} />
            </NavLink>
 
            <button 
              className="ws-mobile-menu-btn" 
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </header>

        <div className="ws-content-wrapper">
          <Outlet context={{ activeUser, workspaces, theme, toggleTheme }} />
        </div>
      </main>

      {/* Persistent Bottom Nav for Mobile — hidden on Add Member page */}
      {location.pathname !== '/workspace/settings' && (
      <nav className="ws-bottom-nav">
        <NavLink to="/workspace" end className={({ isActive }) => `ws-bottom-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={24} />
        </NavLink>
        <NavLink to="/workspace/members" className={({ isActive }) => `ws-bottom-item ${isActive ? 'active' : ''}`}>
          <Users size={24} />
        </NavLink>
        <NavLink to="/workspace/details" className={({ isActive }) => `ws-bottom-item ${isActive ? 'active' : ''}`}>
          <Briefcase size={24} />
        </NavLink>
        <NavLink to="/workspace/menu" className={({ isActive }) => `ws-bottom-item ${isActive ? 'active' : ''}`}>
          <Menu size={24} />
        </NavLink>
      </nav>
      )}
    </div>
  );
};
