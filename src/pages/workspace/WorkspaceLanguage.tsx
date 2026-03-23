import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, CheckCircle2, Languages } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export const WorkspaceLanguage = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const [isClosing, setIsClosing] = useState(false);

  const handleBack = () => {
    setIsClosing(true);
    setTimeout(() => navigate(-1), 350);
  };

  const languages = [
    { 
      id: 'en', 
      name: 'English', 
      nativeName: 'English',
      flag: '🇺🇸'
    },
    { 
      id: 'bn', 
      name: 'Bengali', 
      nativeName: 'বাংলা',
      flag: '🇧🇩'
    }
  ];

  return (
    <div className={`ws-menu-page-container ${isClosing ? 'ws-slide-out-right' : 'ws-slide-in-right'}`}>
      <div className="ws-menu-header-center">
        <button className="ws-menu-back-plain" onClick={handleBack}>
          <ChevronLeft size={28} />
        </button>
        <h1 className="ws-menu-title">
          {language === 'bn' ? 'ভাষা পরিবর্তন' : 'Change Language'}
        </h1>
        <div style={{ width: '44px' }}></div>
      </div>

      <div className="ws-menu-scroll-content">
        <div className="ws-menu-page-width">
          <div className="ws-language-list">
            {languages.map((l) => (
              <button 
                key={l.id}
                className={`ws-language-card ${language === l.id ? 'active' : ''}`}
                onClick={() => {
                  if (language !== l.id) setLanguage(l.id as 'en' | 'bn');
                }}
              >
                <div className="ws-language-info">
                  <span className="ws-language-flag">{l.flag}</span>
                  <div className="ws-language-names">
                    <span className="ws-language-native">{l.nativeName}</span>
                    <span className="ws-language-english">{l.name}</span>
                  </div>
                </div>
                {language === l.id && (
                  <div className="ws-language-check">
                    <CheckCircle2 size={24} />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="ws-settings-group" style={{ marginTop: '2rem' }}>
            <div className="ws-settings-item">
              <div className="ws-settings-info">
                <div className="ws-settings-icon security">
                  <Languages size={20} />
                </div>
                <div className="ws-settings-text">
                  <h3>{language === 'bn' ? 'আঞ্চলিক ভাষা' : 'Regional Dialects'}</h3>
                  <p>{language === 'bn' ? 'পরবর্তীতে আরও ভাষা যোগ করা হবে' : 'More languages coming in future updates'}</p>
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
