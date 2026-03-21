import { Users, Activity, DollarSign, TrendingUp, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { mockUsers } from "../../data/mockUsers";

export const AdminDashboard = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const adminT = t.admin || {} as any;

  // Static Data
  const TOTAL_CASHIERS = 5;

  // Live Simulation State
  const [stats, setStats] = useState({
    revenue: 124500
  });

  useEffect(() => {
    // Simulate live revenue transactions every 2 seconds
    const interval = setInterval(() => {
      setStats(prev => ({
        revenue: prev.revenue + (Math.random() > 0.4 ? Math.floor(Math.random() * 120) : 0),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>{adminT.dashboard || "Dashboard Overview"}</h2>
        <p>{adminT.welcome || "Welcome back, here's what's happening today."}</p>
      </div>

      <div className="admin-stats-grid">
        <div 
          className="admin-card stat-card" 
          onClick={() => navigate('/admin/users')}
          style={{ cursor: 'pointer' }}
        >
          <div className="stat-icon users"><Users size={28} /></div>
          <div className="stat-info">
            <h3>{adminT.totalUsers || "Total Users"}</h3>
            <p className="stat-number">{mockUsers.length}</p>
            <span className="stat-change positive"><TrendingUp size={16} /> Exact</span>
          </div>
        </div>
        
        <div 
          className="admin-card stat-card" 
          onClick={() => navigate('/admin/roles')}
          style={{ cursor: 'pointer' }}
        >
          <div className="stat-icon activity"><Activity size={28} /></div>
          <div className="stat-info">
            <h3>{adminT.totalCashiers || "Total Cashier's"}</h3>
            <p className="stat-number">{TOTAL_CASHIERS.toLocaleString()}</p>
            <span className="stat-change positive"><TrendingUp size={16} /> Exact</span>
          </div>
        </div>

        <div 
          className="admin-card stat-card"
          onClick={() => navigate('/admin/settings')}
          style={{ cursor: 'pointer' }}
        >
          <div className="stat-icon revenue"><DollarSign size={28} /></div>
          <div className="stat-info">
            <h3>{adminT.totalProcessed || "Total Processed"}</h3>
            <p className="stat-number">৳{stats.revenue.toLocaleString()}</p>
            <span className="stat-change positive"><TrendingUp size={16} /> +8% {adminT.thisWeek || "this week"}</span>
          </div>
        </div>
      </div>

      <div className="admin-dashboard-content">
        <div className="admin-card recent-activity-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>{adminT.recentActivity || "Recent Activity"}</h3>
            <button 
              className="admin-btn-text" 
              onClick={() => navigate('/admin/users')}
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              {language === 'bn' ? 'সব দেখুন' : 'View All'}
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-dot new-user"></div>
              <div className="activity-details">
                <p><strong>{adminT.newUserMsg || "New User Registered"}</strong>: Nusrat Jahan</p>
                <span>2 {language === 'bn' ? 'মিনিট আগে' : 'minutes ago'}</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot system"></div>
              <div className="activity-details">
                <p><strong>{adminT.sysUpdateMsg || "System Update"}</strong>: v2.1.0 (Digital-Somiti Core)</p>
                <span>1 {language === 'bn' ? 'ঘণ্টা আগে' : 'hour ago'}</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot payment"></div>
              <div className="activity-details">
                <p><strong>{adminT.paymentMsg || "Payment Received"}</strong>: ৳১৫,০০০ {language === 'bn' ? 'থেকে' : 'from'} Abdul Karim</p>
                <span>3 {language === 'bn' ? 'ঘণ্টা আগে' : 'hours ago'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
