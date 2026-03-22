import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import { Sun, Moon, Languages, Shield, Bell, Palette } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export const WorkspaceSettings = () => {
  const { theme, toggleTheme } = useOutletContext<{ theme: 'light' | 'dark', toggleTheme: () => void }>();
  const { language, setLanguage } = useLanguage();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="ws-overview">
      <div className="ws-header">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {language === 'bn' ? 'সেটিংস' : 'Settings'}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {language === 'bn' ? 'আপনার অ্যাকাউন্টের সেটিংস এবং পছন্দসমূহ পরিবর্তন করুন।' : 'Manage your workspace preferences and account settings.'}
        </motion.p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="ws-settings-container"
      >
        {/* Appearance Section */}
        <motion.section variants={item} className="ws-settings-section">
          <div className="ws-settings-header">
            <Palette size={22} className="ws-settings-icon" />
            <h3>{language === 'bn' ? 'চেহারা' : 'Appearance'}</h3>
          </div>
          <div className="ws-settings-card">
            <div className="ws-setting-item">
              <div className="ws-setting-info">
                <h4>{language === 'bn' ? 'ডার্ক মোড' : 'Dark Mode'}</h4>
                <p>{language === 'bn' ? 'আপনার ইন্টারফেসের থিম পরিবর্তন করুন।' : 'Toggle between light and dark display themes.'}</p>
              </div>
              <button 
                className={`ws-toggle-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={toggleTheme}
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                <span>{theme === 'light' ? (language === 'bn' ? 'ডার্ক' : 'Dark') : (language === 'bn' ? 'লাইট' : 'Light')}</span>
              </button>
            </div>
          </div>
        </motion.section>

        {/* Language Section */}
        <motion.section variants={item} className="ws-settings-section">
          <div className="ws-settings-header">
            <Languages size={22} className="ws-settings-icon" />
            <h3>{language === 'bn' ? 'ভাষা' : 'Language'}</h3>
          </div>
          <div className="ws-settings-card">
            <div className="ws-setting-item">
              <div className="ws-setting-info">
                <h4>{language === 'bn' ? 'সিস্টেম ল্যাঙ্গুয়েজ' : 'System Language'}</h4>
                <p>{language === 'bn' ? 'আপনার পছন্দের ভাষা নির্বাচন করুন।' : 'Select your preferred language for the interface.'}</p>
              </div>
              <div className="ws-lang-switch">
                <button 
                  className={`ws-lang-btn ${language === 'en' ? 'active' : ''}`}
                  onClick={() => setLanguage('en')}
                >
                  English
                </button>
                <button 
                  className={`ws-lang-btn ${language === 'bn' ? 'active' : ''}`}
                  onClick={() => setLanguage('bn')}
                >
                  বাংলা
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Support Section Placeholder */}
        <motion.section variants={item} className="ws-settings-section">
          <div className="ws-settings-header">
            <Shield size={22} className="ws-settings-icon" />
            <h3>{language === 'bn' ? 'নিরাপত্তা ও সহায়তা' : 'Security & Support'}</h3>
          </div>
          <div className="ws-settings-card">
            <div className="ws-setting-item">
              <div className="ws-setting-info">
                <h4>{language === 'bn' ? 'নোটিফিকেশন' : 'Notifications'}</h4>
                <p>{language === 'bn' ? 'কিভাবে নোটিফিকেশন পাবেন তা সেট করুন।' : 'Manage how you receive updates and alerts.'}</p>
              </div>
              <button className="ws-icon-btn active">
                <Bell size={20} />
              </button>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};
