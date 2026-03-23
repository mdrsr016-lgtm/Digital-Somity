import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ChevronLeft, Sun, Moon, Monitor, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export const WorkspaceAppearance = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { theme, toggleTheme } = useOutletContext<any>();
  const [isClosing, setIsClosing] = useState(false);

  const handleBack = () => {
    setIsClosing(true);
    setTimeout(() => navigate(-1), 350);
  };

  const themes = [
    { 
      id: 'light', 
      name: language === 'bn' ? 'লাইট' : 'Light', 
      icon: <Sun size={24} />,
      desc: language === 'bn' ? 'উজ্বল ইন্টারফেস' : 'Classic bright interface'
    },
    { 
      id: 'dark', 
      name: language === 'bn' ? 'ডার্ক' : 'Dark', 
      icon: <Moon size={24} />,
      desc: language === 'bn' ? 'চোখের জন্য আরামদায়ক' : 'Easier on the eyes'
    },
    { 
      id: 'system', 
      name: language === 'bn' ? 'সিস্টেম' : 'System', 
      icon: <Monitor size={24} />,
      desc: language === 'bn' ? 'ডিভাইসের সাথে মিলবে' : 'Match device settings'
    }
  ];

  return (
    <div className={`ws-menu-page-container ${isClosing ? 'ws-slide-out-right' : 'ws-slide-in-right'}`}>
      <div className="ws-menu-header-center">
        <button className="ws-menu-back-plain" onClick={handleBack}>
          <ChevronLeft size={28} />
        </button>
        <h1 className="ws-menu-title">
          {language === 'bn' ? 'অ্যাপিয়ারেন্স' : 'Appearance'}
        </h1>
        <div style={{ width: '44px' }}></div>
      </div>

      <div className="ws-menu-scroll-content">
        <div className="ws-menu-page-width">
          <div className="ws-appearance-grid">
            {themes.map((t) => (
              <button 
                key={t.id}
                className={`ws-theme-card ${theme === t.id ? 'active' : ''}`}
                onClick={() => {
                  if (theme !== t.id) toggleTheme(t.id);
                }}
              >
                <div className="ws-theme-visual">
                  <div className={`ws-theme-mockup ${t.id}`}>
                    <div className="ws-mock-header"></div>
                    <div className="ws-mock-content">
                      <div className="ws-mock-line"></div>
                      <div className="ws-mock-line short"></div>
                    </div>
                  </div>
                  {theme === t.id && (
                    <div className="ws-theme-check">
                      <CheckCircle2 size={20} />
                    </div>
                  )}
                </div>
                <div className="ws-theme-info">
                  <div className="ws-theme-name">
                    {t.icon}
                    <span>{t.name}</span>
                  </div>
                  <p className="ws-theme-desc">{t.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="ws-settings-group" style={{ marginTop: '2rem' }}>
            <div className="ws-settings-item">
              <div className="ws-settings-info">
                <div className="ws-settings-text">
                  <h3>{language === 'bn' ? 'ফন্ট সাইজ' : 'Font Size'}</h3>
                  <p>{language === 'bn' ? 'পরবর্তীতে ফিচারটি যোগ করা হবে' : 'Coming soon in future updates'}</p>
                </div>
              </div>
              <span className="ws-badge-small">{language === 'bn' ? 'শীঘ্রই' : 'Soon'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
