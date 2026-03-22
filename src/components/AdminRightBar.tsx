import { HelpCircle, Languages, Sun, Moon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

interface AdminRightBarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const AdminRightBar = ({ theme, toggleTheme }: AdminRightBarProps) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { t, setLanguage } = useLanguage();

  return (
    <div className="admin-right-bar desktop-only">
      <div className="right-bar-content">
        <button className="right-bar-item" title={t.sidebar.help}>
          <HelpCircle size={20} />
        </button>

        <div className="right-bar-lang-container">
          <button 
            className={`right-bar-item ${isLangOpen ? 'active' : ''}`}
            onClick={() => setIsLangOpen(!isLangOpen)}
            title={t.sidebar.language}
          >
            <Languages size={20} />
          </button>

          <AnimatePresence>
            {isLangOpen && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="right-bar-lang-dropdown"
              >
                <div className="dropdown-header">
                   <span>Select Language</span>
                   <button onClick={() => setIsLangOpen(false)}><X size={14} /></button>
                </div>
                <button className="lang-option" onClick={() => { setLanguage('en'); setIsLangOpen(false); }}>
                  <div className="flag us-flag" />
                  <span>{t.sidebar.langUS}</span>
                </button>
                <button className="lang-option" onClick={() => { setLanguage('bn'); setIsLangOpen(false); }}>
                  <div className="flag bd-flag" />
                  <span>{t.sidebar.langBD}</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button 
          className="right-bar-item" 
          onClick={toggleTheme}
          title={theme === 'light' ? t.sidebar.darkMode : t.sidebar.lightMode}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <div className="right-bar-spacer" />

        <div className="right-bar-logo">
          DS
        </div>
      </div>
    </div>
  );
};
