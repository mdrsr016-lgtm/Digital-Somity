import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { Sidebar } from "./components/Sidebar";
import { HelpModal } from "./components/HelpModal";
import { LanguageProvider } from "./contexts/LanguageContext";
import { useVersionCheck } from "./hooks/useVersionCheck";
import "./styles/UpdateNotification.css";

import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { UsersManagement } from "./pages/admin/UsersManagement";
import { RolesManagement } from "./pages/admin/RolesManagement";
import { AdminSettings } from "./pages/admin/AdminSettings";
import { WorkspaceList } from "./pages/admin/WorkspaceList";
import { UserFridge } from "./pages/admin/UserFridge";
import { WorkspaceLayout } from "./pages/workspace/WorkspaceLayout";
import { WorkspaceOverview } from "./pages/workspace/WorkspaceOverview";
import { WorkspaceProfile } from "./pages/workspace/WorkspaceProfile";
import { WorkspaceUsers } from "./pages/workspace/WorkspaceUsers";
import { WorkspaceSettings } from "./pages/workspace/WorkspaceSettings";
import { WorkspaceNotifications } from "./pages/workspace/WorkspaceNotifications";
import { WorkspaceMessages } from "./pages/workspace/WorkspaceMessages";
import { WorkspaceDetails } from "./pages/workspace/WorkspaceDetails";
import { WorkspaceMenu } from "./pages/workspace/WorkspaceMenu";
import { WorkspaceReport } from "./pages/workspace/WorkspaceReport";
import { WorkspaceAbout } from "./pages/workspace/WorkspaceAbout";
import { WorkspaceSupport } from "./pages/workspace/WorkspaceSupport";
import { WorkspaceNotificationSettings } from "./pages/workspace/WorkspaceNotificationSettings";
import { WorkspaceAppearance } from "./pages/workspace/WorkspaceAppearance";
import { WorkspaceLanguage } from "./pages/workspace/WorkspaceLanguage";

function App() {
  const { isUpdateAvailable, reloadApp } = useVersionCheck();
  
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = (newTheme?: 'light' | 'dark') => {
    if (newTheme) {
      setTheme(newTheme);
    } else {
      setTheme(prev => prev === 'light' ? 'dark' : 'light');
    }
  };

  return (
    <LanguageProvider>
      <Routes>
        <Route path="/" element={
          <>
            <Sidebar 
              theme={theme} 
              toggleTheme={toggleTheme} 
              onHelpClick={() => setIsHelpOpen(true)} 
            />
            <LoginPage />
            <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
          </>
        } />

        <Route path="/admin" element={<AdminLayout theme={theme} toggleTheme={toggleTheme} />}>
          <Route index element={<AdminDashboard />} />
          <Route path="workspaces" element={<WorkspaceList />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="roles" element={<RolesManagement />} />
          <Route path="fridge" element={<UserFridge />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="/workspace" element={<WorkspaceLayout theme={theme} toggleTheme={toggleTheme} />}>
          <Route index element={<WorkspaceOverview />} />
          <Route path="details" element={<WorkspaceDetails />} />
          <Route path="notifications" element={<WorkspaceNotifications />} />
          <Route path="messages" element={<WorkspaceMessages />} />
          <Route path="profile" element={<WorkspaceProfile />} />
          <Route path="members" element={<WorkspaceUsers />} />
          <Route path="settings" element={<WorkspaceSettings />} />
          <Route path="menu" element={<WorkspaceMenu />}>
            <Route path="report" element={<WorkspaceReport />} />
            <Route path="about" element={<WorkspaceAbout />} />
            <Route path="support" element={<WorkspaceSupport />} />
            <Route path="notifications" element={<WorkspaceNotificationSettings />} />
            <Route path="appearance" element={<WorkspaceAppearance />} />
            <Route path="language" element={<WorkspaceLanguage />} />
          </Route>
        </Route>
      </Routes>
      {isUpdateAvailable && <UpdateNotification onReload={reloadApp} />}
    </LanguageProvider>
  );
}

function UpdateNotification({ onReload }: { onReload: () => void }) {
  return (
    <div className="update-notification">
      <span>New app version available!</span>
      <button className="update-btn" onClick={onReload}>Update Now</button>
    </div>
  );
}

export default App;
