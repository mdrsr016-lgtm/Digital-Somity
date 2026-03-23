import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Bell, Shield, Megaphone, Smartphone } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export const WorkspaceNotificationSettings = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isClosing, setIsClosing] = useState(false);

  const [settings, setSettings] = useState({
    push: true,
    system: true,
    marketing: false,
    security: true
  });

  const handleBack = () => {
    setIsClosing(true);
    setTimeout(() => navigate(-1), 350);
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className={`ws-menu-page-container ${isClosing ? 'ws-slide-out-right' : 'ws-slide-in-right'}`}>
      <div className="ws-menu-header-center">
        <button className="ws-menu-back-plain" onClick={handleBack}>
          <ChevronLeft size={28} />
        </button>
        <h1 className="ws-menu-title">
          {language === 'bn' ? 'নোটিফিকেশন সেটিং' : 'Notification Settings'}
        </h1>
        <div style={{ width: '44px' }}></div>
      </div>

      <div className="ws-menu-scroll-content">
        <div className="ws-menu-page-width">
          <div className="ws-settings-group">
            <div className="ws-settings-item">
              <div className="ws-settings-info">
                <div className="ws-settings-icon push">
                  <Smartphone size={20} />
                </div>
                <div className="ws-settings-text">
                  <h3>{language === 'bn' ? 'পুশ নোটিফিকেশন' : 'Push Notifications'}</h3>
                  <p>{language === 'bn' ? 'আপনার ফোনে সরাসরি অ্যালার্ট পান' : 'Get instant alerts on your device'}</p>
                </div>
              </div>
              <button 
                className={`ws-switch ${settings.push ? 'active' : ''}`}
                onClick={() => toggleSetting('push')}
              >
                <div className="ws-switch-handle"></div>
              </button>
            </div>

            <div className="ws-settings-item">
              <div className="ws-settings-info">
                <div className="ws-settings-icon system">
                  <Bell size={20} />
                </div>
                <div className="ws-settings-text">
                  <h3>{language === 'bn' ? 'সিস্টেম আউটগোয়িং' : 'System Alerts'}</h3>
                  <p>{language === 'bn' ? 'সফটওয়্যার আপডেট এবং গুরুত্বপূর্ণ নোটিশ' : 'Software updates and critical notices'}</p>
                </div>
              </div>
              <button 
                className={`ws-switch ${settings.system ? 'active' : ''}`}
                onClick={() => toggleSetting('system')}
              >
                <div className="ws-switch-handle"></div>
              </button>
            </div>

            <div className="ws-settings-item">
              <div className="ws-settings-info">
                <div className="ws-settings-icon security">
                  <Shield size={20} />
                </div>
                <div className="ws-settings-text">
                  <h3>{language === 'bn' ? 'নিরাপত্তা অ্যালার্ট' : 'Security Alerts'}</h3>
                  <p>{language === 'bn' ? 'অ্যাকাউন্ট ভেরিফিকেশন এবং লগইন অ্যালার্ট' : 'Account verification and login alerts'}</p>
                </div>
              </div>
              <button 
                className={`ws-switch ${settings.security ? 'active' : ''}`}
                onClick={() => toggleSetting('security')}
              >
                <div className="ws-switch-handle"></div>
              </button>
            </div>

            <div className="ws-settings-item">
              <div className="ws-settings-info">
                <div className="ws-settings-icon promo">
                  <Megaphone size={20} />
                </div>
                <div className="ws-settings-text">
                  <h3>{language === 'bn' ? 'প্রমোশনাল অফার' : 'Promotional Offers'}</h3>
                  <p>{language === 'bn' ? 'নতুন অফার এবং আপডেট সম্পর্কে জানুন' : 'Learn about new offers and updates'}</p>
                </div>
              </div>
              <button 
                className={`ws-switch ${settings.marketing ? 'active' : ''}`}
                onClick={() => toggleSetting('marketing')}
              >
                <div className="ws-switch-handle"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
