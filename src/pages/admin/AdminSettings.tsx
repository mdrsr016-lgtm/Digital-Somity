import { useLanguage } from "../../contexts/LanguageContext";
import { useState } from "react";

export const AdminSettings = () => {
  const { t } = useLanguage();
  const adminT = t.admin || {} as any;

  const [toggles, setToggles] = useState({
    twoFactor: false,
    strongPass: true
  });

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>{adminT.settings || "Settings"}</h2>
        <p>{adminT.settingsMsg || "Configure overall application settings."}</p>
      </div>

      <div className="settings-grid">
        <div className="admin-card settings-card">
          <h3>{t.lang === 'bn' ? 'সাধারণ তথ্য' : 'General Information'}</h3>
          <div className="settings-form">
            <div className="form-group">
              <label>{t.lang === 'bn' ? 'অ্যাপ্লিকেশনের নাম' : 'Application Name'}</label>
              <input type="text" defaultValue={t.login?.logoText || "Digital Somiti"} className="admin-input" />
            </div>
            <div className="form-group">
              <label>{t.lang === 'bn' ? 'সাপোর্ট ইমেইল' : 'Support Email'}</label>
              <input type="email" defaultValue="support@digitalsomiti.com" className="admin-input" />
            </div>
            <button className="admin-btn-primary">{t.lang === 'bn' ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes'}</button>
          </div>
        </div>

        <div className="admin-card settings-card">
          <h3>{t.lang === 'bn' ? 'নিরাপত্তা বিধি' : 'Security Rules'}</h3>
          <div className="settings-form">
            <div className="settings-toggle-row">
              <label>{t.lang === 'bn' ? 'টু-ফ্যাক্টর প্রমাণীকরণ প্রয়োজন' : 'Require Two-Factor Authentication'}</label>
              <input 
                type="checkbox" 
                className="admin-toggle" 
                checked={toggles.twoFactor} 
                onChange={() => handleToggle('twoFactor')} 
              />
            </div>
            <div className="settings-toggle-row">
              <label>{t.lang === 'bn' ? 'শক্তিশালী পাসওয়ার্ড এনফোর্স করুন' : 'Enforce Strong Passwords'}</label>
              <input 
                type="checkbox" 
                className="admin-toggle" 
                checked={toggles.strongPass} 
                onChange={() => handleToggle('strongPass')} 
              />
            </div>
            <div className="settings-toggle-row">
              <label>{t.lang === 'bn' ? 'সেশন শেষ (মিনিট)' : 'Session Timeout (mins)'}</label>
              <input type="number" defaultValue="30" className="admin-input-small" />
            </div>
            <button className="admin-btn-primary">{t.lang === 'bn' ? 'নিরাপত্তা সেটিংস আপডেট করুন' : 'Update Security Settings'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};
