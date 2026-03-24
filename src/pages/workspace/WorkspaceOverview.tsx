import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { Users, Wallet, TrendingUp } from "lucide-react";

export const WorkspaceOverview = () => {
  const { activeUser, workspaces } = useOutletContext<any>();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const activeWorkspaceName = workspaces?.find((w: any) => w.id === activeUser?.workspaceId)?.name || 'workspace';

  return (
    <div className="ws-page-width ws-overview-page">
      <div className="ws-overview-hero">
        <div className="ws-hero-date">{formatDate(time)}</div>
        <h1 className="ws-hero-greeting">
          {getGreeting()},<br />
          <span className="ws-hero-name">{activeUser?.name || 'User'}!</span>
        </h1>
        <p className="ws-hero-desc">Here's your complete <strong>{activeWorkspaceName}</strong> overview.</p>
        
        <div className="ws-hero-clock-container">
          <div className="ws-live-dot"></div>
          <div className="ws-hero-clock">{formatTime(time)}</div>
        </div>
        <div className="ws-hero-version">v2.1.0 — Workspace Panel</div>
      </div>

      <div className="ws-overview-cards">
        <div className="ws-stat-card">
          <div className="ws-stat-icon-wrapper ws-icon-blue">
            <Users size={28} strokeWidth={2} />
          </div>
          <div className="ws-stat-value">2</div>
          <div className="ws-stat-label">Total Users</div>
          <div className="ws-stat-trend ws-trend-green">
            <TrendingUp size={16} strokeWidth={2.5} />
            <span>+3 new since last week</span>
          </div>
        </div>

        <div className="ws-stat-card">
          <div className="ws-stat-icon-wrapper ws-icon-green">
            <Wallet size={28} strokeWidth={2} />
          </div>
          <div className="ws-stat-value">৳125.3K</div>
          <div className="ws-stat-label">Total Processed</div>
          <div className="ws-stat-trend ws-trend-green">
            <TrendingUp size={16} strokeWidth={2.5} />
            <span>+8% higher than average</span>
          </div>
        </div>
      </div>
    </div>
  );
};
