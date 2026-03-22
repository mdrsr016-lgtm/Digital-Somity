import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import { Shield, Calendar, Edit3, Award, Info, Lock } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useState } from "react";

export const WorkspaceProfile = () => {
  const { activeUser, workspaces } = useOutletContext<any>();
  const { language } = useLanguage();
  const [twoFaClicked, setTwoFaClicked] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="ws-overview">
      <div className="ws-header">
        <h1>{language === 'bn' ? 'আমার প্রোফাইল' : 'My Profile'}</h1>
        <p>{language === 'bn' ? 'আপনার ব্যক্তিগত তথ্য এবং নিরাপত্তা সেটিংস পরিচালনা করুন।' : 'Manage your personal information and security settings.'}</p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="profile-content-grid"
        style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}
      >
        {/* Left Column: Avatar & Basic Info */}
        <motion.div variants={item} className="ws-stat-card" style={{ height: 'fit-content' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem' }}>
            <div className="ws-avatar-xl" style={{ width: '140px', height: '140px', fontSize: '3.5rem' }}>
              {activeUser?.initial}
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{activeUser?.name}</h2>
              <p style={{ color: 'var(--ws-text-muted)', marginBottom: '1rem' }}>
                {language === 'bn' ? activeUser?.roleBn : activeUser?.roleEn}
              </p>
              <div className="ws-verified-pill" style={{ background: 'rgba(235, 255, 30, 0.1)', color: 'var(--ws-lime)', borderColor: 'rgba(235, 255, 30, 0.2)' }}>
                <Shield size={14} />
                {language === 'bn' ? 'ভেরিফায়েড প্রোফাইল' : 'Verified Profile'}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ color: 'var(--ws-violet)' }}><Award size={20} /></div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--ws-text-muted)', margin: 0 }}>{language === 'bn' ? 'সদস্যপদ স্তর' : 'Membership Level'}</p>
                <p style={{ fontWeight: '700', margin: 0 }}>{language === 'bn' ? 'গোল্ড মেম্বার' : 'Gold Member'}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ color: 'var(--ws-violet)' }}><Calendar size={20} /></div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--ws-text-muted)', margin: 0 }}>{language === 'bn' ? 'যোগদানের তারিখ' : 'Member Since'}</p>
                <p style={{ fontWeight: '700', margin: 0 }}>{language === 'bn' ? '১০ জানুয়ারি, ২০২২' : 'Jan 10, 2022'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Detailed Info & Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <motion.div variants={item} className="ws-stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Info size={20} style={{ color: 'var(--ws-violet)' }} />
                {language === 'bn' ? 'ব্যক্তিগত তথ্য' : 'Personal Information'}
              </h3>
              <button className="ws-badge" style={{ cursor: 'pointer', border: 'none' }}>
                <Edit3 size={14} />
                {language === 'bn' ? 'এডিট করুন' : 'Edit Info'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <p style={{ fontSize: '0.85rem', color: 'var(--ws-text-muted)', marginBottom: '0.5rem' }}>{language === 'bn' ? 'ইউজার আইডি' : 'User ID'}</p>
                <p style={{ fontWeight: '600' }}>#{activeUser?.id || 'N/A'}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.85rem', color: 'var(--ws-text-muted)', marginBottom: '0.5rem' }}>{language === 'bn' ? 'ইমেইল' : 'Email Address'}</p>
                <p style={{ fontWeight: '600' }}>{activeUser?.email || 'N/A'}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.85rem', color: 'var(--ws-text-muted)', marginBottom: '0.5rem' }}>{language === 'bn' ? 'শাখা / ওয়ার্কস্পেস' : 'Branch / Workspace'}</p>
                <p style={{ fontWeight: '600' }}>
                  {workspaces.find((w: any) => w.id === activeUser?.workspaceId)?.name || 'General Workspace'}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '0.85rem', color: 'var(--ws-text-muted)', marginBottom: '0.5rem' }}>{language === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}</p>
                <p style={{ fontWeight: '600' }}>{activeUser?.phone || 'N/A'}</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="ws-stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Lock size={20} style={{ color: 'var(--ws-violet)' }} />
                {language === 'bn' ? 'নিরাপত্তা সেটিংস' : 'Security Settings'}
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: 'var(--ws-glass)', borderRadius: '16px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0' }}>{language === 'bn' ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password'}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--ws-text-muted)', margin: 0 }}>{language === 'bn' ? 'শেষ পরিবর্তন: ২ মাস আগে' : 'Last changed: 2 months ago'}</p>
                </div>
                <button className="admin-btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  {language === 'bn' ? 'আপডেট' : 'Update'}
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: 'var(--ws-glass)', borderRadius: '16px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0' }}>{language === 'bn' ? 'দুই-ফ্যাক্টর অথেন্টিকেশন' : 'Two-Factor Authentication'}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--ws-text-muted)', margin: 0 }}>
                    {twoFaClicked
                      ? (language === 'bn' ? '২০২৫ সালে আসছে — শীঘ্রই পাবেন!' : 'Coming in 2025 — stay tuned!')
                      : (language === 'bn' ? 'অতিরিক্ত নিরাপত্তার জন্য চালু করুন' : 'Enable for extra security')}
                  </p>
                </div>
                <div
                  title={language === 'bn' ? 'শীঘ্রই আসছে' : 'Coming Soon'}
                  onClick={() => setTwoFaClicked(true)}
                  style={{ 
                    width: '44px', height: '24px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', 
                    position: 'relative', cursor: 'pointer',
                    border: twoFaClicked ? '1px solid var(--ws-violet)' : '1px solid transparent',
                    transition: 'border 0.2s'
                  }}
                >
                  <div style={{ width: '18px', height: '18px', background: 'var(--ws-text-muted)', borderRadius: '50%', position: 'absolute', top: '3px', left: '3px' }} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
