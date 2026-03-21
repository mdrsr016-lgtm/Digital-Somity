import { useLanguage } from "../../contexts/LanguageContext";
import { useState } from "react";
import { CheckCircle } from "lucide-react";

export const AdminSettings = () => {
  const { t, language } = useLanguage();
  const adminT = t.admin || {} as any;

  const [toggles, setToggles] = useState({
    twoFactor: false,
    strongPass: true
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [securityStatus, setSecurityStatus] = useState<'idle' | 'updating' | 'updated'>('idle');

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 800);
  };

  const handleSecurityUpdate = () => {
    setSecurityStatus('updating');
    setTimeout(() => {
      setSecurityStatus('updated');
      setTimeout(() => setSecurityStatus('idle'), 2000);
    }, 800);
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>{adminT.settings || "Settings"}</h2>
        <p>{adminT.settingsMsg || "Configure overall application settings."}</p>
      </div>

      <div className="settings-grid">
        <div className="admin-card settings-card">
          <h3>{language === 'bn' ? 'সাধারণ তথ্য' : 'General Information'}</h3>
          <div className="settings-form">
            <div className="form-group">
              <label>{language === 'bn' ? 'অ্যাপ্লিকেশনের নাম' : 'Application Name'}</label>
              <input type="text" defaultValue={t.login?.logoText || "Digital Somiti"} className="admin-input" />
            </div>
            <div className="form-group">
              <label>{language === 'bn' ? 'সাপোর্ট ইমেইল' : 'Support Email'}</label>
              <input type="email" defaultValue="support@digitalsomiti.com" className="admin-input" />
            </div>
            <button 
              className={`admin-btn-primary ${saveStatus === 'saved' ? 'success' : ''}`}
              onClick={handleSave}
              disabled={saveStatus !== 'idle'}
            >
              {saveStatus === 'idle' && (language === 'bn' ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes')}
              {saveStatus === 'saving' && (language === 'bn' ? 'সংরক্ষণ করা হচ্ছে...' : 'Saving...')}
              {saveStatus === 'saved' && (
                <>
                  <CheckCircle size={18} style={{ marginRight: '8px' }} />
                  {language === 'bn' ? 'সংরক্ষিত!' : 'Saved!'}
                </>
              )}
            </button>
          </div>
        </div>

        <div className="admin-card settings-card">
          <h3>{language === 'bn' ? 'নিরাপত্তা বিধি' : 'Security Rules'}</h3>
          <div className="settings-form">
            <div className="settings-toggle-row">
              <label>{language === 'bn' ? 'টু-ফ্যাক্টর প্রমাণীকরণ প্রয়োজন' : 'Require Two-Factor Authentication'}</label>
              <input 
                type="checkbox" 
                className="admin-toggle" 
                checked={toggles.twoFactor} 
                onChange={() => handleToggle('twoFactor')} 
              />
            </div>
            <div className="settings-toggle-row">
              <label>{language === 'bn' ? 'শক্তিশালী পাসওয়ার্ড এনফোর্স করুন' : 'Enforce Strong Passwords'}</label>
              <input 
                type="checkbox" 
                className="admin-toggle" 
                checked={toggles.strongPass} 
                onChange={() => handleToggle('strongPass')} 
              />
            </div>
            <div className="settings-toggle-row">
              <label>{language === 'bn' ? 'সেশন শেষ (মিনিট)' : 'Session Timeout (mins)'}</label>
              <input type="number" defaultValue="30" className="admin-input-small" />
            </div>
            <button 
              className={`admin-btn-primary ${securityStatus === 'updated' ? 'success' : ''}`}
              onClick={handleSecurityUpdate}
              disabled={securityStatus !== 'idle'}
            >
              {securityStatus === 'idle' && (language === 'bn' ? 'নিরাপত্তা সেটিংস আপডেট করুন' : 'Update Security Settings')}
              {securityStatus === 'updating' && (language === 'bn' ? 'আপডেট করা হচ্ছে...' : 'Updating...')}
              {securityStatus === 'updated' && (
                <>
                  <CheckCircle size={18} style={{ marginRight: '8px' }} />
                  {language === 'bn' ? 'আপডেট সম্পন্ন!' : 'Updated!'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
