import { useOutletContext, useNavigate, NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  LogOut,
  Bell,
  ChevronLeft,
  LayoutDashboard,
  Users,
  UserPlus,
  Briefcase,
  HelpCircle,
  ShieldCheck,
  MessageSquare,
  Palette,
  Inbox,
  Info
} from "lucide-react";

export const WorkspaceMenu = () => {
  const { activeUser } = useOutletContext<any>();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("ds_logged_in_user");
    navigate("/");
  };

  const handleBack = () => {
    setIsClosing(true);
    setTimeout(() => navigate(-1), 350);
  };

  const menuItems = [
    { icon: <LayoutDashboard size={24} />, label: language === 'bn' ? 'ওভারভিউ' : 'Overview', to: '/workspace' },
    { icon: <Users size={24} />, label: language === 'bn' ? 'সদস্য তালিকা' : 'Members', to: '/workspace/members' },
    { icon: <UserPlus size={24} />, label: language === 'bn' ? 'সদস্য যোগ' : 'Add User', to: '/workspace/settings' },
    { icon: <Briefcase size={24} />, label: language === 'bn' ? 'ওয়ার্কস্পেস' : 'Workspace', to: '/workspace/details' },
    { icon: <Bell size={24} />, label: language === 'bn' ? 'নোটিফিকেশন' : 'Notifications', to: '/workspace/notifications' },
    { icon: <MessageSquare size={24} />, label: language === 'bn' ? 'মেসেজ' : 'Messages', to: '/workspace/messages' },
    { icon: <HelpCircle size={24} />, label: language === 'bn' ? 'সহায়তা' : 'Help & Support', to: '/workspace/help' },
    { icon: <ShieldCheck size={24} />, label: language === 'bn' ? 'নিরাপত্তা' : 'Privacy', to: '/workspace/privacy' },
  ];

  return (
    <div className={`ws-menu-page-container ${isClosing ? 'ws-slide-out-right' : 'ws-slide-in-right'}`}>
      {/* Header matching image */}
      <div className="ws-menu-header-center">
        <button className="ws-menu-back-plain" onClick={handleBack}>
          <ChevronLeft size={28} />
        </button>
        <h1 className="ws-menu-title">{language === 'bn' ? 'মেন্যু' : 'Menu'}</h1>
        <div style={{ width: '44px' }}></div> {/* Spacer to keep title centered */}
      </div>

      <div className="ws-menu-scroll-content">
        {/* User Card matching image */}
        <div className="ws-menu-page-width">
          <NavLink to="/workspace/profile" className="ws-menu-user-card-new">
            <div className="ws-menu-avatar-circle">
              {activeUser?.initial || '?'}
            </div>
            <div className="ws-menu-user-details">
              <h3>{activeUser?.name}</h3>
              <p>{language === 'bn' ? 'আপনার প্রোফাইল দেখুন' : 'View your profile'}</p>
            </div>
          </NavLink>

          {/* Grid Layout matching image */}
          <div className="ws-menu-grid-new">
            {menuItems.map((item, idx) => (
              <NavLink key={idx} to={item.to} className="ws-menu-grid-card">
                <div className="ws-menu-grid-icon">
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Flattened Settings & Help Items */}
        <div className="ws-menu-flat-list">
          <button className="ws-submenu-item">
            <div className="ws-submenu-icon"><Palette size={24} /></div>
            <span>{language === 'bn' ? 'চেহারা' : 'Appearance'}</span>
          </button>
          <button className="ws-submenu-item">
            <div className="ws-submenu-icon"><Bell size={24} /></div>
            <span>{language === 'bn' ? 'নোটিফিকেশন সেটিং' : 'Notification settings'}</span>
          </button>
          <button className="ws-submenu-item">
            <div className="ws-submenu-icon"><Inbox size={24} /></div>
            <span>{language === 'bn' ? 'সাপোর্ট ইনবক্স' : 'Support Inbox'}</span>
          </button>
          <NavLink to="report" className="ws-submenu-item">
            <div className="ws-submenu-icon"><HelpCircle size={24} /></div>
            <span>{language === 'bn' ? 'সমস্যা রিপোর্ট করুন' : 'Report a problem'}</span>
          </NavLink>
          <button className="ws-submenu-item">
            <div className="ws-submenu-icon"><Info size={24} /></div>
            <span>{language === 'bn' ? 'সম্পর্কে' : 'About'}</span>
          </button>
        </div>

        {/* Separate Logout Section */}
        <div className="ws-menu-logout-section">
          <button onClick={handleLogout} className="ws-submenu-item logout">
            <LogOut size={24} />
            <span>{language === 'bn' ? 'লগ আউট' : 'Log Out'}</span>
          </button>
        </div>
      </div>
      <Outlet />
    </div>
  );
};
