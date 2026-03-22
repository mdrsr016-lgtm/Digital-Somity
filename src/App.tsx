import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { Sidebar } from "./components/Sidebar";
import { HelpModal } from "./components/HelpModal";
import { LanguageProvider } from "./contexts/LanguageContext";

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

function App() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
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
          <Route path="profile" element={<WorkspaceProfile />} />
          <Route path="members" element={<WorkspaceUsers />} />
        </Route>
      </Routes>
    </LanguageProvider>
  );
}

export default App;
