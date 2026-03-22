import { motion } from "framer-motion";
import { Bell, CheckCircle } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

const mockNotifications = [
  { id: 'n1', title: 'Monthly collection reminder', titleBn: 'মাসিক সংগ্রহের অনুস্মারক', time: '2h ago', unread: true },
  { id: 'n2', title: 'Your savings statement is ready', titleBn: 'আপনার সঞ্চয় বিবরণী প্রস্তুত', time: '1d ago', unread: true },
  { id: 'n3', title: 'New workspace event posted', titleBn: 'নতুন ইভেন্ট পোস্ট করা হয়েছে', time: '3d ago', unread: false },
];

export const WorkspaceNotifications = () => {
  const { language } = useLanguage();

  return (
    <div className="ws-overview">
      <div className="ws-header">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {language === 'bn' ? 'নোটিফিকেশন' : 'Notifications'}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {language === 'bn' ? 'আপনার সর্বশেষ আপডেট এখানে।' : 'Your latest updates are here.'}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="ws-stat-card"
        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
      >
        {mockNotifications.map((n) => (
          <div
            key={n.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '14px 18px',
              borderRadius: '14px',
              background: n.unread ? 'var(--ws-glass)' : 'transparent',
              border: n.unread ? '1px solid var(--border-color)' : '1px solid transparent',
            }}
          >
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: n.unread ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)',
              color: n.unread ? 'var(--ws-violet)' : 'var(--ws-text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              {n.unread ? <Bell size={18} /> : <CheckCircle size={18} />}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: n.unread ? 600 : 400, color: 'var(--ws-text)' }}>
                {language === 'bn' ? n.titleBn : n.title}
              </p>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--ws-text-muted)' }}>{n.time}</p>
            </div>
            {n.unread && (
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--ws-violet)', flexShrink: 0 }} />
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
};
