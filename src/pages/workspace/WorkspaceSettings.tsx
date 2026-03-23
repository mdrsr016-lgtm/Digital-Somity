import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Sun, Moon, Bell } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export const WorkspaceSettings = () => {
  const { theme, toggleTheme, activeUser, workspaces } = useOutletContext<{ 
    theme: 'light' | 'dark', 
    toggleTheme: () => void,
    activeUser: any,
    workspaces: any[]
  }>();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');

  const activeWorkspaceName = workspaces?.find(w => w.id === activeUser?.workspaceId)?.name || '';

  const handleDeleteWorkspace = () => {
    // Implement delete logic here in the future
    setIsDeleteModalOpen(false);
    setDeleteInput('');
    // e.g., navigate to /admin or home
    navigate('/');
  };

  return (
    <div className="ws-settings-pro">
      <div className="ws-settings-pro-header">
        <h1>{language === 'bn' ? 'সেটিংস' : 'Settings'}</h1>
        <p>{language === 'bn' ? 'আপনার ওয়ার্কস্পেস কনফিগার করুন।' : 'Manage your workspace preferences and environment.'}</p>
      </div>

      <div className="ws-settings-pro-content">
        {/* Appearance */}
        <div className="ws-settings-pro-row">
          <div className="ws-settings-pro-info">
            <h3>{language === 'bn' ? 'ইন্টারফেস থিম' : 'Interface Theme'}</h3>
            <p>{language === 'bn' ? 'আপনার ড্যাশবোর্ডের চেহারা কাস্টমাইজ করুন।' : 'Customize the visual appearance of your dashboard.'}</p>
          </div>
          <div className="ws-settings-pro-action">
            <div className="ws-theme-segmented">
              <button 
                className={`ws-theme-btn ${theme === 'light' ? 'active' : ''}`}
                onClick={() => theme !== 'light' && toggleTheme()}
              >
                <Sun size={16} />
                <span>{language === 'bn' ? 'লাইট' : 'Light'}</span>
              </button>
              <button 
                className={`ws-theme-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => theme !== 'dark' && toggleTheme()}
              >
                <Moon size={16} />
                <span>{language === 'bn' ? 'ডার্ক' : 'Dark'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="ws-settings-divider" />

        {/* Language */}
        <div className="ws-settings-pro-row">
          <div className="ws-settings-pro-info">
            <h3>{language === 'bn' ? 'সিস্টেম ল্যাঙ্গুয়েজ' : 'System Language'}</h3>
            <p>{language === 'bn' ? 'পুরো সিস্টেমের জন্য আপনার পছন্দের ভাষা নির্বাচন করুন।' : 'Select the primary language used across the application.'}</p>
          </div>
          <div className="ws-settings-pro-action">
            <div className="ws-theme-segmented">
              <button 
                className={`ws-theme-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
              >
                English
              </button>
              <button 
                className={`ws-theme-btn ${language === 'bn' ? 'active' : ''}`}
                onClick={() => setLanguage('bn')}
              >
                বাংলা
              </button>
            </div>
          </div>
        </div>

        <div className="ws-settings-divider" />

        {/* Notifications */}
        <div className="ws-settings-pro-row">
          <div className="ws-settings-pro-info">
            <h3>{language === 'bn' ? 'পুশ নোটিফিকেশন' : 'Push Notifications'}</h3>
            <p>{language === 'bn' ? 'রিয়েল-টাইম আপডেট এবং অ্যালার্ট নিয়ন্ত্রণ করুন।' : 'Manage how you receive real-time updates and notifications.'}</p>
          </div>
          <div className="ws-settings-pro-action">
            <button className="ws-action-btn">
              <Bell size={16} />
              <span>{language === 'bn' ? 'কনফিগার করুন' : 'Configure'}</span>
            </button>
          </div>
        </div>
        
        <div className="ws-settings-divider" />

        {/* Danger Zone */}
        <div className="ws-settings-pro-row danger">
          <div className="ws-settings-pro-info">
            <h3 style={{ color: '#ef4444' }}>{language === 'bn' ? 'অ্যাকাউন্ট মুছুন' : 'Delete Workspace'}</h3>
            <p>{language === 'bn' ? 'স্থায়ীভাবে আপনার ওয়ার্কস্পেস এবং সমস্ত ডেটা মুছে ফেলুন।' : 'Permanently remove your workspace and all of its contents. This action is not reversible.'}</p>
          </div>
          <div className="ws-settings-pro-action">
            <button 
              className="ws-action-btn danger-btn"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              {language === 'bn' ? 'মুছে ফেলুন' : 'Delete Workspace'}
            </button>
          </div>
        </div>
      </div>

      {/* GitHub-style Delete Modal */}
      {isDeleteModalOpen && (
        <div className="ws-delete-modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="ws-delete-modal" onClick={e => e.stopPropagation()}>
            <h3 className="ws-delete-modal-title">
              {language === 'bn' ? 'আপনি কি নিশ্চিত?' : 'Are you absolutely sure?'}
            </h3>
            
            <div className="ws-delete-modal-content">
              <p>
                {language === 'bn' 
                  ? 'এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না। এটি স্থায়ীভাবে আপনার ওয়ার্কস্পেস এবং সমস্ত ডেটা মুছে ফেলবে।' 
                  : 'This action cannot be undone. This will permanently delete your workspace.'}
              </p>
              <p>
                {language === 'bn' ? 'নিশ্চিত করতে টাইপ করুন:' : 'Please type'} <strong>{activeWorkspaceName}</strong> {language === 'bn' ? '' : 'to confirm.'}
              </p>
              <input 
                type="text" 
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                className="ws-delete-input"
              />
            </div>

            <div className="ws-delete-modal-actions">
              <button 
                className="ws-action-btn"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteInput('');
                }}
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button 
                className="ws-action-btn danger-btn"
                disabled={deleteInput !== activeWorkspaceName}
                onClick={handleDeleteWorkspace}
              >
                {language === 'bn' 
                  ? 'আমি এর পরিণতি বুঝতে পারছি, এই ওয়ার্কস্পেস মুছে ফেলুন' 
                  : 'I understand the consequences, delete this workspace'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
