import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import { TrendingUp, Users, Calendar, ShieldCheck, PieChart, Activity, Wallet } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export const WorkspaceOverview = () => {
  const { activeUser } = useOutletContext<any>();
  const { language } = useLanguage();

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
          {language === 'bn' ? 'ওভারভিউ ড্যাশবোর্ড' : 'Workspace Overview'}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {language === 'bn' ? `স্বাগতম, ${activeUser?.name}! আপনার বর্তমান প্রকল্পের স্থিতি দেখুন।` : `Welcome back, ${activeUser?.name}! Here's your workspace status.`}
        </motion.p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="ws-stats-grid"
      >
        <motion.div variants={item} className="ws-stat-card">
          <div className="ws-stat-icon-box" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
            <Wallet size={28} />
          </div>
          <div className="ws-stat-info">
            <h4>{language === 'bn' ? 'মোট সঞ্চয়' : 'Total Savings'}</h4>
            <h2>৳ ২৪,৫০০</h2>
            <div className="ws-stat-trend up">
              <TrendingUp size={14} />
              +১২.৫%
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="ws-stat-card">
          <div className="ws-stat-icon-box" style={{ background: 'rgba(235, 255, 30, 0.15)', color: '#ebff1e' }}>
            <Users size={28} />
          </div>
          <div className="ws-stat-info">
            <h4>{language === 'bn' ? 'সক্রিয় সদস্য' : 'Active Members'}</h4>
            <h2>১২০</h2>
            <div className="ws-stat-trend up">
              <TrendingUp size={14} />
              +৪.২%
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="ws-stat-card">
          <div className="ws-stat-icon-box" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
            <Activity size={28} />
          </div>
          <div className="ws-stat-info">
            <h4>{language === 'bn' ? 'সাম্প্রতিক লেনদেন' : 'Recent Transactions'}</h4>
            <h2>১৫</h2>
            <div className="ws-stat-trend neutral">
              {language === 'bn' ? 'সারা মাস' : 'This Month'}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="dashboard-main-grid">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="ws-profile-card"
        >
          <div className="ws-avatar-xl">
            {activeUser?.initial}
          </div>
          <div className="ws-profile-details">
            <h2>{activeUser?.name}</h2>
            <p>{language === 'bn' ? activeUser?.roleBn : activeUser?.roleEn}</p>
            <div className="ws-verified-pill">
              <ShieldCheck size={16} />
              {language === 'bn' ? 'ভেরিফায়েড প্রোফাইল' : 'Verified Profile'}
            </div>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button className="admin-btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
                {language === 'bn' ? 'প্রোফাইল আপডেট করুন' : 'Update Profile'}
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="ws-stat-card"
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
        >
          <div className="ws-stat-icon-box" style={{ background: 'rgba(235, 255, 30, 0.1)', color: '#ebff1e', width: '80px', height: '80px', borderRadius: '50%' }}>
            <PieChart size={40} />
          </div>
          <h3 style={{ margin: '15px 0 10px' }}>{language === 'bn' ? 'লভ্যাংশ লক্ষ্য' : 'Profit Goal'}</h3>
          <p style={{ color: 'var(--ws-text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
            {language === 'bn' ? 'আপনি এই মাসে আপনার লক্ষ্যের ৮০% অর্জন করেছেন।' : 'You have achieved 80% of your goal this month.'}
          </p>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '80%' }}
              transition={{ duration: 1, delay: 0.8 }}
              style={{ height: '100%', background: 'var(--ws-lime)', boxShadow: '0 0 10px var(--ws-lime)' }}
            />
          </div>
        </motion.div>
      </div>

      <div className="ws-events-grid">
        {[1, 2, 3].map((i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + (i * 0.1) }}
            className="ws-stat-card"
            style={{ padding: '1.5rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--ws-violet)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={18} />
              </div>
              <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Upcoming Event {i}</h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--ws-text-muted)', margin: 0 }}>
              {language === 'bn' ? 'সদস্যদের জন্য বিশেষ প্রশিক্ষণ সেশন।' : 'Special training session for members.'}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
