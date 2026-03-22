import {
  Users, Wallet, UserCog, Activity, TrendingUp, TrendingDown,
  AlertTriangle, Shield, Database,
  ArrowRight, Zap, BarChart2, PieChart, FileText,
  UserPlus, Settings, RefreshCw, Server, CheckCircle, XCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";
import { mockUsers } from "../../data/mockUsers";

// ─── Static Config ────────────────────────────────────────────────────────────
const TOTAL_CASHIERS = 5;
const SYSTEM_VERSION = "v2.1.0";
const LAST_BACKUP = "Today, 06:00 AM";

// ─── Mock monthly collection data (last 7 months) ────────────────────────────
const monthlyData = [
  { month: 'Sep', amount: 72000, bn: 'সেপ' },
  { month: 'Oct', amount: 85000, bn: 'অক্টো' },
  { month: 'Nov', amount: 91000, bn: 'নভে' },
  { month: 'Dec', amount: 78000, bn: 'ডিসে' },
  { month: 'Jan', amount: 104000, bn: 'জান' },
  { month: 'Feb', amount: 118000, bn: 'ফেব' },
  { month: 'Mar', amount: 0, bn: 'মার্চ', current: true },
];

// ─── Role breakdown ───────────────────────────────────────────────────────────
const roleBreakdown = [
  { role: 'Admin',     roleBn: 'অ্যাডমিন',    count: 1,  color: '#7d39eb', pct: 5   },
  { role: 'Cashier',   roleBn: 'ক্যাশিয়ার',   count: 5,  color: '#3b82f6', pct: 25  },
  { role: 'Investor',  roleBn: 'বিনিয়োগকারী', count: 8,  color: '#10b981', pct: 40  },
  { role: 'Member',    roleBn: 'সদস্য',        count: 6,  color: '#f59e0b', pct: 30  },
];

// ─── Recent transactions ──────────────────────────────────────────────────────
const recentTransactions = [
  { id: 't1', name: 'Nusrat Jahan',   initial: 'N', amount: '৳2,500', status: 'processing', colorClass: 'tx-avatar-blue',   timeAgo: '5m ago'  },
  { id: 't2', name: 'Abdul Karim',    initial: 'A', amount: '৳1,800', status: 'completed',  colorClass: 'tx-avatar-green',  timeAgo: '22m ago' },
  { id: 't3', name: 'Fatema Begum',   initial: 'F', amount: '৳3,000', status: 'processing', colorClass: 'tx-avatar-orange', timeAgo: '1h ago'  },
  { id: 't4', name: 'Rahim Uddin',    initial: 'R', amount: '৳5,200', status: 'completed',  colorClass: 'tx-avatar-violet', timeAgo: '2h ago'  },
  { id: 't5', name: 'Kohinoor Akter', initial: 'K', amount: '৳1,200', status: 'pending',    colorClass: 'tx-avatar-pink',   timeAgo: '3h ago'  },
];

// ─── System health checks ─────────────────────────────────────────────────────
const systemChecks = [
  { label: 'Database',       labelBn: 'ডেটাবেস',      status: 'ok'   },
  { label: 'Auth Service',   labelBn: 'অথ সার্ভিস',   status: 'ok'   },
  { label: 'Backup',         labelBn: 'ব্যাকআপ',       status: 'ok'   },
  { label: 'API Gateway',    labelBn: 'এপিআই গেটওয়ে', status: 'ok'   },
  { label: 'Email Service',  labelBn: 'ইমেইল সার্ভিস', status: 'warn' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getGreeting(hour: number, lang: string) {
  if (lang === 'bn') {
    if (hour < 12) return 'শুভ সকাল,';
    if (hour < 17) return 'শুভ অপরাহ্ণ,';
    return 'শুভ সন্ধ্যা,';
  }
  if (hour < 12) return 'Good morning,';
  if (hour < 17) return 'Good afternoon,';
  return 'Good evening,';
}

function getFormattedDate(lang: string) {
  const now = new Date();
  if (lang === 'bn') return now.toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  return now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
}

function StatusDot({ status }: { status: string }) {
  if (status === 'ok')   return <CheckCircle size={16} className="dash-sys-ok"   />;
  if (status === 'warn') return <AlertTriangle size={16} className="dash-sys-warn" />;
  return <XCircle size={16} className="dash-sys-err" />;
}

const BAR_MAX = Math.max(...monthlyData.map(d => d.amount), 1);

// ─── Card animation variant ───────────────────────────────────────────────────
const cardAnim = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export const AdminDashboard = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const adminT = t.admin || {} as any;
  const now = new Date();

  const [revenue, setRevenue] = useState(124500);
  const [activeSessions, setActiveSessions] = useState(7);
  const [liveTime, setLiveTime] = useState(new Date());

  useEffect(() => {
    const rev = setInterval(() => {
      setRevenue(p => p + (Math.random() > 0.4 ? Math.floor(Math.random() * 150) : 0));
    }, 2500);
    const sess = setInterval(() => {
      setActiveSessions(p => Math.max(3, Math.min(15, p + (Math.random() > 0.5 ? 1 : -1))));
    }, 4000);
    const clk = setInterval(() => setLiveTime(new Date()), 1000);
    return () => { clearInterval(rev); clearInterval(sess); clearInterval(clk); };
  }, []);

  const greeting     = getGreeting(now.getHours(), language);
  const dateStr      = getFormattedDate(language);
  const isBn         = language === 'bn';
  const totalMembers = mockUsers.length + roleBreakdown.reduce((a, r) => a + r.count, 0);
  const healthOk     = systemChecks.filter(c => c.status === 'ok').length;

  const kpiCards = [
    {
      id: 'members',
      icon: <Users size={22} />,
      colorClass: 'dash-icon-blue',
      number: totalMembers,
      label: adminT.totalUsers || 'Total Members',
      change: '+3 this week',
      changeBn: 'এ সপ্তাহে +৩',
      trend: 'up',
      onClick: () => navigate('/admin/users'),
    },
    {
      id: 'collected',
      icon: <Wallet size={22} />,
      colorClass: 'dash-icon-green',
      number: `৳${(revenue / 1000).toFixed(1)}K`,
      label: adminT.totalProcessed || 'Total Collected',
      change: '+8% this month',
      changeBn: 'এ মাসে +৮%',
      trend: 'up',
    },
    {
      id: 'cashiers',
      icon: <UserCog size={22} />,
      colorClass: 'dash-icon-violet',
      number: TOTAL_CASHIERS,
      label: adminT.totalCashiers || "Active Cashiers",
      change: 'All online',
      changeBn: 'সবাই অনলাইন',
      trend: 'up',
      onClick: () => navigate('/admin/roles'),
    },
    {
      id: 'sessions',
      icon: <Activity size={22} />,
      colorClass: 'dash-icon-orange',
      number: activeSessions,
      label: isBn ? 'সক্রিয় সেশন' : 'Active Sessions',
      change: isBn ? 'রিয়েল-টাইম' : 'Real-time',
      changeBn: 'রিয়েল-টাইম',
      trend: 'neutral',
      live: true,
    },
  ];

  return (
    <div className="admin-page prof-dash">

      {/* ═══ HERO HEADER ══════════════════════════════════════════════════════ */}
      <motion.div
        className="prof-hero"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="prof-hero-left">
          <p className="prof-date">{dateStr}</p>
          <h1 className="prof-greeting">
            {greeting} <span>{isBn ? 'ক্যাপ্টেন!' : 'Captain!'}</span>
          </h1>
          <p className="prof-subtitle">
            {isBn
              ? 'ডিজিটাল সমিতি সিস্টেমের সম্পূর্ণ ওভারভিউ এখানে।'
              : 'Here\'s your complete Digital Somiti system overview.'}
          </p>
        </div>
        <div className="prof-hero-right">
          <div className="prof-live-time">
            <span className="prof-live-dot" />
            {liveTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <p className="prof-version">{SYSTEM_VERSION} — {isBn ? 'ডিজিটাল সমিতি কোর' : 'Digital Somiti Core'}</p>
        </div>
      </motion.div>

      {/* ═══ KPI CARDS ════════════════════════════════════════════════════════ */}
      <motion.div
        className="prof-kpi-grid"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      >
        {kpiCards.map(card => (
          <motion.div
            key={card.id}
            className={`admin-card prof-kpi-card ${card.onClick ? 'clickable' : ''}`}
            variants={cardAnim}
            onClick={card.onClick}
          >
            <div className="prof-kpi-top">
              <div className={`dash-stat-icon-bubble ${card.colorClass}`}>{card.icon}</div>
              {card.live && <span className="prof-live-badge">{isBn ? 'লাইভ' : 'LIVE'}</span>}
            </div>
            <p className="prof-kpi-number">{card.number}</p>
            <p className="prof-kpi-label">{card.label}</p>
            <div className={`prof-kpi-change ${card.trend}`}>
              {card.trend === 'up' && <TrendingUp size={13} />}
              {card.trend === 'down' && <TrendingDown size={13} />}
              <span>{isBn ? card.changeBn : card.change}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ═══ MIDDLE ROW: Chart + Role Breakdown ══════════════════════════════ */}
      <div className="prof-mid-row">

        {/* Monthly Collection Chart */}
        <motion.div className="admin-card prof-chart-card" variants={cardAnim} initial="hidden" animate="show">
          <div className="prof-card-header">
            <div className="prof-card-title">
              <BarChart2 size={18} />
              <span>{isBn ? 'মাসিক সংগ্রহ' : 'Monthly Collection'}</span>
            </div>
            <span className="prof-card-sub">{isBn ? 'গত ৬ মাস' : 'Last 6 months'}</span>
          </div>
          <div className="prof-bar-chart">
            {monthlyData.map(d => {
              const pct = d.amount > 0 ? Math.round((d.amount / BAR_MAX) * 100) : 4;
              return (
                <div key={d.month} className="prof-bar-col">
                  <span className="prof-bar-value">{d.amount > 0 ? `৳${(d.amount/1000).toFixed(0)}K` : ''}</span>
                  <div className={`prof-bar-fill ${d.current ? 'current' : ''}`} style={{ height: `${pct}%` }} />
                  <span className="prof-bar-label">{isBn ? d.bn : d.month}</span>
                </div>
              );
            })}
          </div>
          <div className="prof-chart-totals">
            <div className="prof-chart-total-item">
              <span>{isBn ? 'মোট সংগৃহীত' : 'Total Collected'}</span>
              <strong>৳{(revenue).toLocaleString()}</strong>
            </div>
            <div className="prof-chart-total-item">
              <span>{isBn ? 'মাসিক গড়' : 'Monthly Avg'}</span>
              <strong>৳{Math.round(revenue / 7).toLocaleString()}</strong>
            </div>
          </div>
        </motion.div>

        {/* Role & Member Breakdown */}
        <motion.div className="admin-card prof-roles-card" variants={cardAnim} initial="hidden" animate="show">
          <div className="prof-card-header">
            <div className="prof-card-title">
              <PieChart size={18} />
              <span>{isBn ? 'সদস্য বিভাজন' : 'Member Breakdown'}</span>
            </div>
            <span className="prof-card-sub">{isBn ? 'ভূমিকা অনুযায়ী' : 'By role'}</span>
          </div>

          {/* Donut ring using CSS conic-gradient */}
          <div className="prof-donut-wrap">
            <div
              className="prof-donut"
              style={{
                background: `conic-gradient(
                  #7d39eb   0% 5%,
                  #3b82f6   5% 30%,
                  #10b981  30% 70%,
                  #f59e0b  70% 100%
                )`,
              }}
            >
              <div className="prof-donut-center">
                <strong>{totalMembers}</strong>
                <span>{isBn ? 'মোট' : 'Total'}</span>
              </div>
            </div>
          </div>

          <div className="prof-role-list">
            {roleBreakdown.map(r => (
              <div key={r.role} className="prof-role-item">
                <div className="prof-role-left">
                  <span className="prof-role-dot" style={{ background: r.color }} />
                  <span className="prof-role-name">{isBn ? r.roleBn : r.role}</span>
                </div>
                <div className="prof-role-right">
                  <div className="prof-role-bar-track">
                    <div className="prof-role-bar-fill" style={{ width: `${r.pct}%`, background: r.color }} />
                  </div>
                  <span className="prof-role-count">{r.count}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ═══ BOTTOM ROW: Transactions + System + Quick Actions ════════════════ */}
      <div className="prof-bottom-row">

        {/* Recent Transactions */}
        <motion.div className="admin-card prof-tx-card" variants={cardAnim} initial="hidden" animate="show">
          <div className="prof-card-header">
            <div className="prof-card-title">
              <FileText size={18} />
              <span>{isBn ? 'সাম্প্রতিক লেনদেন' : 'Recent Transactions'}</span>
            </div>
            <button className="admin-btn-text prof-view-all-btn" onClick={() => navigate('/admin/users')}>
              {isBn ? 'সব দেখুন' : 'View all'} <ArrowRight size={14} />
            </button>
          </div>
          <div className="prof-tx-list">
            {recentTransactions.map(tx => (
              <div key={tx.id} className="dash-tx-item">
                <div className={`dash-tx-avatar ${tx.colorClass}`}>{tx.initial}</div>
                <div className="dash-tx-info">
                  <span className="dash-tx-name">{tx.name}</span>
                  <span className="dash-tx-amount">{tx.amount}</span>
                </div>
                <div className="prof-tx-meta">
                  <span className="prof-tx-time">{tx.timeAgo}</span>
                  {tx.status === 'completed'  && <span className="prof-badge badge-green">{isBn ? 'সম্পন্ন' : 'Done'}</span>}
                  {tx.status === 'processing' && <span className="prof-badge badge-orange">{isBn ? 'চলছে' : 'Processing'}</span>}
                  {tx.status === 'pending'    && <span className="prof-badge badge-gray">{isBn ? 'বাকি' : 'Pending'}</span>}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right column: System Health + Quick Actions */}
        <div className="prof-right-col">

          {/* System Health */}
          <motion.div className="admin-card prof-sys-card" variants={cardAnim} initial="hidden" animate="show">
            <div className="prof-card-header">
              <div className="prof-card-title">
                <Server size={18} />
                <span>{isBn ? 'সিস্টেম স্বাস্থ্য' : 'System Health'}</span>
              </div>
              <span className="prof-health-badge">
                {healthOk}/{systemChecks.length} {isBn ? 'সুস্থ' : 'Healthy'}
              </span>
            </div>
            <div className="prof-sys-list">
              {systemChecks.map(s => (
                <div key={s.label} className="prof-sys-item">
                  <StatusDot status={s.status} />
                  <span className="prof-sys-label">{isBn ? s.labelBn : s.label}</span>
                  <span className={`prof-sys-status ${s.status}`}>
                    {s.status === 'ok' ? (isBn ? 'সচল' : 'Online') : (isBn ? 'সতর্কতা' : 'Warning')}
                  </span>
                </div>
              ))}
            </div>
            <div className="prof-sys-footer">
              <Database size={13} />
              <span>{isBn ? 'শেষ ব্যাকআপ:' : 'Last backup:'} {LAST_BACKUP}</span>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div className="admin-card prof-qa-card" variants={cardAnim} initial="hidden" animate="show">
            <div className="prof-card-header">
              <div className="prof-card-title">
                <Zap size={18} />
                <span>{adminT.quickActions || 'Quick Actions'}</span>
              </div>
            </div>
            <div className="prof-qa-grid">
              <button className="prof-qa-btn" onClick={() => navigate('/admin/users')}>
                <UserPlus size={18} /><span>{adminT.addNewUser || 'Add User'}</span>
              </button>
              <button className="prof-qa-btn" onClick={() => navigate('/admin/roles')}>
                <Shield size={18} /><span>{adminT.userRoles || 'Manage Roles'}</span>
              </button>
              <button className="prof-qa-btn" onClick={() => navigate('/admin/settings')}>
                <Settings size={18} /><span>{adminT.settingsLabel || 'Settings'}</span>
              </button>
              <button className="prof-qa-btn" onClick={() => window.location.reload()}>
                <RefreshCw size={18} /><span>{isBn ? 'রিফ্রেশ' : 'Refresh'}</span>
              </button>
            </div>
          </motion.div>

        </div>
      </div>

    </div>
  );
};
