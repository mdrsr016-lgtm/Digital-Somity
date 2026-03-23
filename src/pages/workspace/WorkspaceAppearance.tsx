import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ChevronLeft, Sun, Moon, CheckCircle2 } from "lucide-react";
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
      desc: language === 'bn' ? ' উজ্বল ইন্টারফেস' : 'Classic bright interface'
    },
    { 
      id: 'dark', 
      name: language === 'bn' ? 'ডার্ক' : 'Dark', 
      icon: <Moon size={24} />,
      desc: language === 'bn' ? 'চোখের জন্য আরামদায়ক' : 'Easier on the eyes'
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
                      <div className="ws-mock-line accent"></div>
                      <div className="ws-mock-line"></div>
                      <div className="ws-mock-line short"></div>
                    </div>
                  </div>
                  {theme === t.id && (
                    <div className="ws-theme-check">
                      <CheckCircle2 size={18} />
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

          <div className="ws-settings-group" style={{ marginTop: '1.5rem' }}>
            <div className="ws-settings-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1.25rem' }}>
              <div className="ws-settings-info" style={{ width: '100%', justifyContent: 'space-between' }}>
                <div className="ws-settings-text">
                  <h3 style={{ fontSize: '1.1rem' }}>{language === 'bn' ? 'ফন্ট সাইজ' : 'Font Size'}</h3>
                  <p>{language === 'bn' ? 'লেখার আকার পরিবর্তন করুন' : 'Adjust the text size for the interface'}</p>
                </div>
                <span className="ws-badge-small" style={{ opacity: 0.6 }}>{language === 'bn' ? 'শীঘ্রই' : 'Soon'}</span>
              </div>
              
              <div style={{ width: '100%', padding: '0 0.5rem' }}>
                <div style={{ 
                  height: '6px', 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  borderRadius: '100px', 
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <div style={{ 
                    width: '40%', 
                    height: '100%', 
                    background: 'var(--ws-violet)', 
                    borderRadius: '100px',
                    opacity: 0.3
                  }}></div>
                  <div style={{ 
                    width: '18px', 
                    height: '18px', 
                    background: '#fff', 
                    borderRadius: '50%', 
                    position: 'absolute',
                    left: '40%',
                    transform: 'translateX(-50%)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                    cursor: 'not-allowed'
                  }}></div>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '0.75rem',
                  fontSize: '0.75rem',
                  color: 'var(--ws-text-muted)',
                  fontWeight: 600
                }}>
                  <span>A</span>
                  <span style={{ fontSize: '1rem' }}>A</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
