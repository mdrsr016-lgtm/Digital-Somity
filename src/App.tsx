import { useState, useEffect } from "react";
import { LoginPage } from "./pages/LoginPage";
import { Sidebar } from "./components/Sidebar";
import { HelpModal } from "./components/HelpModal";
import { LanguageProvider } from "./contexts/LanguageContext";

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
      <Sidebar 
        theme={theme} 
        toggleTheme={toggleTheme} 
        onHelpClick={() => setIsHelpOpen(true)} 
      />
      <LoginPage />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </LanguageProvider>
  );
}

export default App;
