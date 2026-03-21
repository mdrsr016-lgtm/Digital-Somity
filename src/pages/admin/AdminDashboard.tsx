import { Users, Activity, DollarSign, TrendingUp } from "lucide-react";

export const AdminDashboard = () => {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Dashboard Overview</h2>
        <p>Welcome back, here's what's happening today.</p>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-card stat-card">
          <div className="stat-icon users"><Users size={24} /></div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p className="stat-number">12,345</p>
            <span className="stat-change positive"><TrendingUp size={16} /> +12% this week</span>
          </div>
        </div>
        
        <div className="admin-card stat-card">
          <div className="stat-icon activity"><Activity size={24} /></div>
          <div className="stat-info">
            <h3>Active Sessions</h3>
            <p className="stat-number">1,234</p>
            <span className="stat-change positive"><TrendingUp size={16} /> +5% this week</span>
          </div>
        </div>

        <div className="admin-card stat-card">
          <div className="stat-icon revenue"><DollarSign size={24} /></div>
          <div className="stat-info">
            <h3>Revenue</h3>
            <p className="stat-number">$45,678</p>
            <span className="stat-change positive"><TrendingUp size={16} /> +8% this week</span>
          </div>
        </div>
      </div>

      <div className="admin-dashboard-content">
        <div className="admin-card recent-activity-card">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-dot new-user"></div>
              <div className="activity-details">
                <p><strong>New User Registered</strong>: Alice Smith</p>
                <span>2 minutes ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot system"></div>
              <div className="activity-details">
                <p><strong>System Update</strong>: Version 2.1 deployed</p>
                <span>1 hour ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot payment"></div>
              <div className="activity-details">
                <p><strong>Payment Received</strong>: $150.00 from Bob Jones</p>
                <span>3 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
