import { Users, Activity, DollarSign, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

export const AdminDashboard = () => {
  const { t } = useLanguage();
  const adminT = t.admin || {} as any;

  // Live Simulation State
  const [stats, setStats] = useState({
    users: 4852,
    sessions: 312,
    revenue: 124500
  });

  useEffect(() => {
    // Simulate live traffic every 3 seconds
    const interval = setInterval(() => {
      setStats(prev => ({
        users: prev.users + (Math.random() > 0.7 ? 1 : 0),
        sessions: prev.sessions + Math.floor(Math.random() * 5) - 2, // Sessions fluctuate up and down
        revenue: prev.revenue + (Math.random() > 0.5 ? Math.floor(Math.random() * 50) : 0),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>{adminT.dashboard || "Dashboard Overview"}</h2>
        <p>{adminT.welcome || "Welcome back, here's what's happening today."}</p>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-card stat-card">
          <div className="stat-icon users"><Users size={28} /></div>
          <div className="stat-info">
            <h3>{adminT.totalUsers || "Total Users"}</h3>
            <p className="stat-number">{stats.users.toLocaleString()}</p>
            <span className="stat-change positive"><TrendingUp size={16} /> +12% {adminT.thisWeek || "this week"}</span>
          </div>
        </div>
        
        <div className="admin-card stat-card">
          <div className="stat-icon activity"><Activity size={28} /></div>
          <div className="stat-info">
            <h3>{adminT.activeSessions || "Active Sessions"}</h3>
            <p className="stat-number">{stats.sessions.toLocaleString()}</p>
            <span className="stat-change positive"><TrendingUp size={16} /> +5% {adminT.thisWeek || "this week"}</span>
          </div>
        </div>

        <div className="admin-card stat-card">
          <div className="stat-icon revenue"><DollarSign size={28} /></div>
          <div className="stat-info">
            <h3>{adminT.revenue || "Revenue"}</h3>
            <p className="stat-number">৳{stats.revenue.toLocaleString()}</p>
            <span className="stat-change positive"><TrendingUp size={16} /> +8% {adminT.thisWeek || "this week"}</span>
          </div>
        </div>
      </div>

      <div className="admin-dashboard-content">
        <div className="admin-card recent-activity-card">
          <h3>{adminT.recentActivity || "Recent Activity"}</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-dot new-user"></div>
              <div className="activity-details">
                <p><strong>{adminT.newUserMsg || "New User Registered"}</strong>: Nusrat Jahan</p>
                <span>2 {t.lang === 'bn' ? 'মিনিট আগে' : 'minutes ago'}</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot system"></div>
              <div className="activity-details">
                <p><strong>{adminT.sysUpdateMsg || "System Update"}</strong>: v2.1.0 (Digital-Somiti Core)</p>
                <span>1 {t.lang === 'bn' ? 'ঘণ্টা আগে' : 'hour ago'}</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot payment"></div>
              <div className="activity-details">
                <p><strong>{adminT.paymentMsg || "Payment Received"}</strong>: ৳১৫,০০০ {t.lang === 'bn' ? 'থেকে' : 'from'} Abdul Karim</p>
                <span>3 {t.lang === 'bn' ? 'ঘণ্টা আগে' : 'hours ago'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
