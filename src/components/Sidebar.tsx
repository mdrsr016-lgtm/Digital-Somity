import { HelpCircle, Languages, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import "../styles/Sidebar.css";

interface SidebarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onHelpClick: () => void;
}

export const Sidebar = ({ theme, toggleTheme, onHelpClick }: SidebarProps) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { t, setLanguage } = useLanguage();

  return (
    <div className="sidebar">
      <button className="sidebar-item" onClick={onHelpClick}>
        <HelpCircle size={24} />
        <span className="sidebar-tooltip">{t.sidebar.help}</span>
      </button>

      <div className="language-selector-container">
        <button 
          className={`sidebar-item language-selector ${isLangOpen ? 'active' : ''}`}
          onClick={() => setIsLangOpen(!isLangOpen)}
        >
          <Languages size={24} />
          <span className="sidebar-tooltip">{t.sidebar.language}</span>
        </button>

        <AnimatePresence>
          {isLangOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="language-dropdown"
              style={{ overflow: 'hidden' }}
            >
              <button className="dropdown-item" onClick={() => { setLanguage('en'); setIsLangOpen(false); }}>
                <div className="flag us-flag" />
                <span className="lang-name">{t.sidebar.langUS}</span>
              </button>
              <div className="dropdown-divider" />
              <button className="dropdown-item" onClick={() => { setLanguage('bn'); setIsLangOpen(false); }}>
                <div className="flag bd-flag" />
                <span className="lang-name">{t.sidebar.langBD}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button 
        className="sidebar-item theme-toggle" 
        onClick={toggleTheme}
      >
        {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
        <span className="sidebar-tooltip">{theme === 'light' ? t.sidebar.darkMode : t.sidebar.lightMode}</span>
      </button>

      <div style={{ marginTop: 'auto', marginBottom: '1rem' }}>
        <a href="/admin" className="sidebar-item" style={{ color: 'inherit', textDecoration: 'none' }} title="Admin Panel">
          <div className="sidebar-logo" style={{ width: '24px', height: '24px', background: 'var(--color-violet)', borderRadius: '6px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
            DS
          </div>
          <span className="sidebar-tooltip">Admin</span>
        </a>
      </div>
    </div>
  );
};
