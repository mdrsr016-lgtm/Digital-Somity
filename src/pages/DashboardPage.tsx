import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Users,
  TrendingUp,
  CreditCard,
  Settings,
  LogOut,
  Bell,
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Building2,
  PieChart,
  FileText,
  Shield,
  ShieldCheck,
  Crown,
  Briefcase,
  BadgeDollarSign,
  UserCheck,
  Moon,
  Sun,
  Globe,
  X,
  UserPlus,
  Zap,
  CheckCircle2,
  AlertCircle,
  Plus,
  Sparkles,
  Sliders,
  Check,
  Download,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useToast } from "../contexts/ToastContext";

// ─── Types ───────────────────────────────────────────────────────────────────
type NavItem = {
  id: string;
  icon: React.ReactNode;
  label: string;
  labelBn: string;
};

// ─── Role-based nav configs ──────────────────────────────────────────────────
const NAV_BY_ROLE: Record<string, NavItem[]> = {
  founder: [
    { id: "home", icon: <Home size={22} />, label: "Overview", labelBn: "সংক্ষিপ্ত" },
    { id: "branches", icon: <Building2 size={22} />, label: "Branches", labelBn: "শাখাসমূহ" },
    { id: "members", icon: <Users size={22} />, label: "Members", labelBn: "সদস্যগণ" },
    { id: "finance", icon: <TrendingUp size={22} />, label: "Finance", labelBn: "অর্থায়ন" },
    { id: "reports", icon: <FileText size={22} />, label: "Reports", labelBn: "প্রতিবেদন" },
    { id: "settings", icon: <Settings size={22} />, label: "Settings", labelBn: "সেটিংস" },
  ],
  admin: [
    { id: "home", icon: <Home size={22} />, label: "Overview", labelBn: "সংক্ষিপ্ত" },
    { id: "members", icon: <Users size={22} />, label: "Members", labelBn: "সদস্যগণ" },
    { id: "finance", icon: <TrendingUp size={22} />, label: "Finance", labelBn: "অর্থায়ন" },
    { id: "reports", icon: <FileText size={22} />, label: "Reports", labelBn: "প্রতিবেদন" },
    { id: "settings", icon: <Settings size={22} />, label: "Settings", labelBn: "সেটিংস" },
  ],
  manager: [
    { id: "home", icon: <Home size={22} />, label: "Overview", labelBn: "সংক্ষিপ্ত" },
    { id: "members", icon: <Users size={22} />, label: "Members", labelBn: "সদস্যগণ" },
    { id: "transactions", icon: <CreditCard size={22} />, label: "Transactions", labelBn: "লেনদেন" },
    { id: "reports", icon: <FileText size={22} />, label: "Reports", labelBn: "প্রতিবেদন" },
  ],
  cashier: [
    { id: "home", icon: <Home size={22} />, label: "Overview", labelBn: "সংক্ষিপ্ত" },
    { id: "transactions", icon: <CreditCard size={22} />, label: "Transactions", labelBn: "লেনদেন" },
    { id: "members", icon: <Users size={22} />, label: "Members", labelBn: "সদস্যগণ" },
  ],
  investor: [
    { id: "home", icon: <Home size={22} />, label: "Portfolio", labelBn: "পোর্টফোলিও" },
    { id: "finance", icon: <PieChart size={22} />, label: "Returns", labelBn: "আয়" },
    { id: "transactions", icon: <CreditCard size={22} />, label: "Transactions", labelBn: "লেনদেন" },
  ],
  member: [
    { id: "home", icon: <Home size={22} />, label: "My Account", labelBn: "আমার অ্যাকাউন্ট" },
    { id: "transactions", icon: <CreditCard size={22} />, label: "Transactions", labelBn: "লেনদেন" },
    { id: "finance", icon: <Wallet size={22} />, label: "Savings", labelBn: "সঞ্চয়" },
  ],
};

// ─── Role badge icon ─────────────────────────────────────────────────────────
const RoleIcon: React.FC<{ role: string; color: string }> = ({ role, color }) => {
  const icons: Record<string, React.ReactNode> = {
    founder: <Crown size={14} />,
    admin: <Shield size={14} />,
    manager: <Briefcase size={14} />,
    cashier: <BadgeDollarSign size={14} />,
    investor: <TrendingUp size={14} />,
    member: <UserCheck size={14} />,
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        color,
        fontSize: 11,
        fontWeight: 600,
        background: `${color}18`,
        border: `1px solid ${color}40`,
        borderRadius: 999,
        padding: "2px 8px",
      }}
    >
      {icons[role]}
    </span>
  );
};

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard: React.FC<{
  label: string;
  value: string;
  sub?: string;
  subType?: "success" | "warning" | "error" | "brand" | "neutral";
  subColor?: string;
  icon: React.ReactNode;
  accent: string;
}> = ({ label, value, sub, subType, subColor, icon, accent }) => {
  let color = "var(--color-text-muted)";
  let bg = "transparent";
  let border = "transparent";
  let isPill = false;

  if (sub) {
    const s = sub.toLowerCase();
    const isSuccess =
      subType === "success" ||
      (!subType &&
        (sub.startsWith("+") ||
          s.includes("growth") ||
          s.includes("roi") ||
          s.includes("vs last") ||
          s.includes("month") ||
          s.includes("week") ||
          s.includes("collected") ||
          s.includes("deposited")));
    const isWarning =
      subType === "warning" ||
      (!subType &&
        (s.includes("pending") || s.includes("review") || s.includes("awaiting")));
    const isError =
      subType === "error" ||
      (!subType && (sub.startsWith("-") || s.includes("declined") || s.includes("overdue")));

    if (subColor) {
      color = subColor;
      bg = `${subColor}18`;
      border = `${subColor}35`;
      isPill = true;
    } else if (isSuccess) {
      color = "var(--color-success)";
      bg = "var(--color-success-soft)";
      border = "rgba(16, 185, 129, 0.25)";
      isPill = true;
    } else if (isWarning) {
      color = "var(--color-warning)";
      bg = "var(--color-warning-soft)";
      border = "rgba(245, 158, 11, 0.25)";
      isPill = true;
    } else if (isError) {
      color = "var(--color-error)";
      bg = "var(--color-error-soft)";
      border = "rgba(239, 68, 68, 0.25)";
      isPill = true;
    } else if (subType === "brand") {
      color = "var(--color-brand)";
      bg = "var(--color-brand-soft)";
      border = "rgba(15, 91, 228, 0.25)";
      isPill = true;
    } else {
      color = "var(--color-text-muted)";
      bg = "transparent";
      border = "transparent";
      isPill = false;
    }
  }

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minWidth: 0,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 12, color: "var(--color-text-muted)", fontWeight: 500 }}>{label}</span>
        <span
          style={{
            width: 32,
            height: 32,
            borderRadius: "var(--radius-md)",
            background: `${accent}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: accent,
            flexShrink: 0,
          }}
        >
          {icon}
        </span>
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: "var(--color-text-primary)", fontFamily: "var(--font-heading)" }}>
        {value}
      </div>
      {sub && (
        <div style={{ display: "flex", alignItems: "center", minHeight: 22 }}>
          {isPill ? (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "2px 8px",
                borderRadius: "var(--radius-full)",
                fontSize: 11,
                fontWeight: 600,
                color,
                background: bg,
                border: `1px solid ${border}`,
                width: "fit-content",
                lineHeight: 1.3,
              }}
            >
              {sub}
            </span>
          ) : (
            <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{sub}</span>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Transaction Row ─────────────────────────────────────────────────────────
const TxRow: React.FC<{ name: string; amount: string; type: "in" | "out"; date: string }> = ({
  name,
  amount,
  type,
  date,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 0",
      borderBottom: "1px solid var(--color-border-subtle)",
    }}
  >
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "var(--radius-md)",
        background: type === "in" ? "var(--color-success-soft)" : "var(--color-error-soft)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: type === "in" ? "var(--color-success)" : "var(--color-error)",
        flexShrink: 0,
      }}
    >
      {type === "in" ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
      <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{date}</div>
    </div>
    <div
      style={{
        fontSize: 14,
        fontWeight: 700,
        color: type === "in" ? "var(--color-success)" : "var(--color-error)",
        flexShrink: 0,
      }}
    >
      {type === "in" ? "+" : "-"}৳{amount}
    </div>
  </div>
);

// ─── Action Center Component ──────────────────────────────────────────────────
interface ActionItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accent: string;
  badge?: string;
  badgeColor?: string;
}

const ActionCenter: React.FC<{
  role: string;
  onNavigateTab?: (tab: string) => void;
}> = ({ role, onNavigateTab }) => {
  const { success, info } = useToast();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState(2);
  const [approvalsList, setApprovalsList] = useState([
    {
      id: "app-1",
      title: "Sylhet Sadar Branch Expansion",
      category: "Branch License • Sylhet East",
      detail: "Manager: Kamal Hossain • Est. Members: 240",
      status: "pending",
    },
    {
      id: "app-2",
      title: "Agro Micro-Credit (৳150,000)",
      category: "Loan Application • Rahim Enterprise",
      detail: "Credit Score: 820 • Collateral Verified",
      status: "pending",
    },
  ]);

  // Form states
  const [branchName, setBranchName] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [branchManager, setBranchManager] = useState("");
  const [branchCapital, setBranchCapital] = useState("");

  const [memberName, setMemberName] = useState("");
  const [memberPhone, setMemberPhone] = useState("");
  const [memberNid, setMemberNid] = useState("");
  const [memberBranch, setMemberBranch] = useState("");

  const [loanMember, setLoanMember] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanTenure, setLoanTenure] = useState("");

  const [depositMember, setDepositMember] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [depositScheme, setDepositScheme] = useState("");

  const actions: ActionItem[] = [
    {
      id: "branch",
      title: "New Branch",
      subtitle: "Add & assign manager",
      icon: <Building2 size={18} />,
      accent: "#10B981",
    },
    {
      id: "member",
      title: "Add Member",
      subtitle: "KYC registration",
      icon: <UserPlus size={18} />,
      accent: "#0F5BE4",
    },
    {
      id: "loan",
      title: "Disburse Loan",
      subtitle: "Issue micro-credit",
      icon: <ArrowUpRight size={18} />,
      accent: "#EA580C",
    },
    {
      id: "deposit",
      title: "Collect Deposit",
      subtitle: "Savings & DPS",
      icon: <ArrowDownLeft size={18} />,
      accent: "#059669",
    },
    {
      id: "approvals",
      title: "Approvals",
      subtitle: `${pendingCount} items pending`,
      icon: <ShieldCheck size={18} />,
      accent: "#F59E0B",
      badge: pendingCount > 0 ? `${pendingCount}` : undefined,
      badgeColor: "#F59E0B",
    },
    {
      id: "audit",
      title: "Audit Report",
      subtitle: "Export statements",
      icon: <FileText size={18} />,
      accent: "#9333EA",
    },
  ];

  const handleApprove = (id: string, name: string) => {
    setApprovalsList((prev) => prev.filter((item) => item.id !== id));
    setPendingCount((c) => Math.max(0, c - 1));
    success("Approval Confirmed", `Approved "${name}" successfully!`);
    if (approvalsList.length <= 1) {
      setTimeout(() => setActiveModal(null), 400);
    }
  };

  const handleReject = (id: string, name: string) => {
    setApprovalsList((prev) => prev.filter((item) => item.id !== id));
    setPendingCount((c) => Math.max(0, c - 1));
    info("Request Declined", `Declined "${name}".`);
    if (approvalsList.length <= 1) {
      setTimeout(() => setActiveModal(null), 400);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "var(--radius-md)",
    border: "1px solid var(--color-border)",
    background: "var(--color-surface-hover)",
    color: "var(--color-text-primary)",
    fontSize: 13,
    outline: "none",
    marginBottom: 12,
    fontFamily: "var(--font-ui)",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "var(--color-text-secondary)",
    marginBottom: 4,
  };

  return (
    <>
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: "16px",
          marginBottom: 20,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "var(--radius-md)",
                background: "var(--color-brand-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-brand)",
              }}
            >
              <Zap size={15} />
            </div>
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "-0.01em",
                }}
              >
                Action Center
              </div>
              <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                Quick platform operations & workflows
              </div>
            </div>
          </div>

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "3px 8px",
              borderRadius: 999,
              fontSize: 10,
              fontWeight: 600,
              background: "var(--color-brand-soft)",
              color: "var(--color-brand)",
              border: "1px solid rgba(15, 91, 228, 0.25)",
            }}
          >
            ⚡ 6 Fast Ops
          </span>
        </div>

        {/* Priority Pending Strip */}
        {pendingCount > 0 && (
          <div
            onClick={() => setActiveModal("approvals")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 12px",
              borderRadius: "var(--radius-md)",
              background: "var(--color-warning-soft)",
              border: "1px solid rgba(245, 158, 11, 0.28)",
              marginBottom: 14,
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--color-warning)",
                  boxShadow: "0 0 8px var(--color-warning)",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-warning)" }}>
                {pendingCount} branch approvals awaiting your review
              </span>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--color-warning)",
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexShrink: 0,
              }}
            >
              Review <ChevronRight size={12} />
            </span>
          </div>
        )}

        {/* Action Grid (2x3) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 10,
          }}
        >
          {actions.map((act) => (
            <motion.button
              key={act.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveModal(act.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px",
                background: "var(--color-surface-hover)",
                border: "1px solid var(--color-border-subtle)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                textAlign: "left",
                position: "relative",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "var(--radius-md)",
                  background: `${act.accent}18`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: act.accent,
                  flexShrink: 0,
                }}
              >
                {act.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--color-text-primary)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {act.title}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--color-text-muted)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {act.subtitle}
                </div>
              </div>

              {act.badge && (
                <span
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: act.badgeColor || "var(--color-brand)",
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {act.badge}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Action Modals ── */}
      <AnimatePresence>
        {activeModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.75)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
            }}
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: 420,
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-xl)",
                boxShadow: "var(--shadow-modal)",
                padding: "22px 20px",
                maxHeight: "90vh",
                overflowY: "auto",
                boxSizing: "border-box",
              }}
            >
              {/* Modal Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: 18,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "var(--radius-md)",
                      background:
                        activeModal === "branch"
                          ? "#10B98118"
                          : activeModal === "member"
                          ? "#0F5BE418"
                          : activeModal === "loan"
                          ? "#EA580C18"
                          : activeModal === "deposit"
                          ? "#05966918"
                          : activeModal === "approvals"
                          ? "#F59E0B18"
                          : "#9333EA18",
                      color:
                        activeModal === "branch"
                          ? "#10B981"
                          : activeModal === "member"
                          ? "#0F5BE4"
                          : activeModal === "loan"
                          ? "#EA580C"
                          : activeModal === "deposit"
                          ? "#059669"
                          : activeModal === "approvals"
                          ? "#F59E0B"
                          : "#9333EA",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {activeModal === "branch" && <Building2 size={20} />}
                    {activeModal === "member" && <UserPlus size={20} />}
                    {activeModal === "loan" && <ArrowUpRight size={20} />}
                    {activeModal === "deposit" && <ArrowDownLeft size={20} />}
                    {activeModal === "approvals" && <ShieldCheck size={20} />}
                    {activeModal === "audit" && <FileText size={20} />}
                  </div>
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 700,
                        color: "var(--color-text-primary)",
                        fontFamily: "var(--font-heading)",
                      }}
                    >
                      {activeModal === "branch" && "Create New Branch"}
                      {activeModal === "member" && "Register New Member"}
                      {activeModal === "loan" && "Disburse Micro-Credit Loan"}
                      {activeModal === "deposit" && "Collect Deposit / Savings"}
                      {activeModal === "approvals" && `Pending Approvals (${pendingCount})`}
                      {activeModal === "audit" && "Financial Audit & Export"}
                    </h3>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--color-text-muted)" }}>
                      {activeModal === "branch" && "Expand platform operations to a new region"}
                      {activeModal === "member" && "Onboard member with KYC and savings account"}
                      {activeModal === "loan" && "Issue approved credit capital to member"}
                      {activeModal === "deposit" && "Record savings or DPS cash contribution"}
                      {activeModal === "approvals" && "Review queued branch & loan requests"}
                      {activeModal === "audit" && "Authoritative balance sheets & statements"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveModal(null)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--color-text-muted)",
                    cursor: "pointer",
                    padding: 4,
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* 1. Branch Form */}
              {activeModal === "branch" && (
                <div>
                  <label style={labelStyle}>Branch Name</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g., Dhanmondi Central Branch"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                  />

                  <label style={labelStyle}>Branch Code</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g., BR-08 (Dhanmondi)"
                    value={branchCode}
                    onChange={(e) => setBranchCode(e.target.value)}
                  />

                  <label style={labelStyle}>Assigned Branch Manager</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g., Tareq Rahman"
                    value={branchManager}
                    onChange={(e) => setBranchManager(e.target.value)}
                  />

                  <label style={labelStyle}>Initial Vault Capital (BDT)</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g., ৳ 500,000"
                    value={branchCapital}
                    onChange={(e) => setBranchCapital(e.target.value)}
                  />

                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <button
                      onClick={() => setActiveModal(null)}
                      style={{
                        padding: "10px 16px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--color-border)",
                        background: "transparent",
                        color: "var(--color-text-secondary)",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        success("Branch Created", `Branch "${branchName || "Dhanmondi Central"}" created successfully!`);
                        setActiveModal(null);
                        setBranchName("");
                        setBranchCode("");
                        setBranchManager("");
                        setBranchCapital("");
                      }}
                      style={{
                        flex: 1,
                        padding: "10px 16px",
                        borderRadius: "var(--radius-md)",
                        border: "none",
                        background: "#10B981",
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Create Branch
                    </button>
                  </div>
                </div>
              )}

              {/* 2. Member Form */}
              {activeModal === "member" && (
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g., Fatima Begum"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                  />

                  <label style={labelStyle}>Phone Number</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g., +880 1712-345678"
                    value={memberPhone}
                    onChange={(e) => setMemberPhone(e.target.value)}
                  />

                  <label style={labelStyle}>National ID (NID)</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g., 1994829104829"
                    value={memberNid}
                    onChange={(e) => setMemberNid(e.target.value)}
                  />

                  <label style={labelStyle}>Assigned Branch</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g., Mirpur Main Branch"
                    value={memberBranch}
                    onChange={(e) => setMemberBranch(e.target.value)}
                  />

                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <button
                      onClick={() => setActiveModal(null)}
                      style={{
                        padding: "10px 16px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--color-border)",
                        background: "transparent",
                        color: "var(--color-text-secondary)",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        success("Member Registered", `Member "${memberName || "Fatima Begum"}" added to Somiti roster!`);
                        setActiveModal(null);
                        setMemberName("");
                        setMemberPhone("");
                        setMemberNid("");
                        setMemberBranch("");
                      }}
                      style={{
                        flex: 1,
                        padding: "10px 16px",
                        borderRadius: "var(--radius-md)",
                        border: "none",
                        background: "var(--color-brand)",
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Register Member
                    </button>
                  </div>
                </div>
              )}

              {/* 3. Loan Disburse Form */}
              {activeModal === "loan" && (
                <div>
                  <label style={labelStyle}>Select Member</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g., Karim Uddin (MEM-1042)"
                    value={loanMember}
                    onChange={(e) => setLoanMember(e.target.value)}
                  />

                  <label style={labelStyle}>Disbursement Amount (BDT)</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g., ৳ 50,000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                  />

                  <label style={labelStyle}>Repayment Scheme</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g., 12 Months (Micro-Business Plan)"
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(e.target.value)}
                  />

                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <button
                      onClick={() => setActiveModal(null)}
                      style={{
                        padding: "10px 16px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--color-border)",
                        background: "transparent",
                        color: "var(--color-text-secondary)",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        success("Loan Disbursed", `৳${loanAmount || "50,000"} issued to ${loanMember || "Karim Uddin"}.`);
                        setActiveModal(null);
                        setLoanMember("");
                        setLoanAmount("");
                        setLoanTenure("");
                      }}
                      style={{
                        flex: 1,
                        padding: "10px 16px",
                        borderRadius: "var(--radius-md)",
                        border: "none",
                        background: "#EA580C",
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Disburse Capital
                    </button>
                  </div>
                </div>
              )}

              {/* 4. Deposit Form */}
              {activeModal === "deposit" && (
                <div>
                  <label style={labelStyle}>Member ID / Name</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g., Amina Khatun (MEM-0891)"
                    value={depositMember}
                    onChange={(e) => setDepositMember(e.target.value)}
                  />

                  <label style={labelStyle}>Deposit Amount (BDT)</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g., ৳ 5,000"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />

                  <label style={labelStyle}>Deposit Type</label>
                  <input
                    style={inputStyle}
                    placeholder="e.g., Monthly DPS / Savings"
                    value={depositScheme}
                    onChange={(e) => setDepositScheme(e.target.value)}
                  />

                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <button
                      onClick={() => setActiveModal(null)}
                      style={{
                        padding: "10px 16px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--color-border)",
                        background: "transparent",
                        color: "var(--color-text-secondary)",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        success("Deposit Recorded", `৳${depositAmount || "5,000"} credited to ${depositMember || "savings account"}!`);
                        setActiveModal(null);
                        setDepositMember("");
                        setDepositAmount("");
                        setDepositScheme("");
                      }}
                      style={{
                        flex: 1,
                        padding: "10px 16px",
                        borderRadius: "var(--radius-md)",
                        border: "none",
                        background: "#059669",
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Record Deposit
                    </button>
                  </div>
                </div>
              )}

              {/* 5. Approvals List */}
              {activeModal === "approvals" && (
                <div>
                  {approvalsList.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "24px 0", color: "var(--color-text-muted)" }}>
                      <CheckCircle2 size={36} color="var(--color-success)" style={{ marginBottom: 8 }} />
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text-primary)" }}>All Caught Up!</div>
                      <div style={{ fontSize: 12 }}>No pending approvals remaining.</div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {approvalsList.map((app) => (
                        <div
                          key={app.id}
                          style={{
                            padding: "12px",
                            background: "var(--color-surface-hover)",
                            border: "1px solid var(--color-border)",
                            borderRadius: "var(--radius-md)",
                          }}
                        >
                          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-primary)" }}>
                            {app.title}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--color-brand)", margin: "2px 0" }}>
                            {app.category}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginBottom: 10 }}>
                            {app.detail}
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button
                              onClick={() => handleReject(app.id, app.title)}
                              style={{
                                padding: "6px 12px",
                                borderRadius: "var(--radius-sm)",
                                border: "1px solid var(--color-border)",
                                background: "var(--color-error-soft)",
                                color: "var(--color-error)",
                                fontSize: 11,
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleApprove(app.id, app.title)}
                              style={{
                                flex: 1,
                                padding: "6px 12px",
                                borderRadius: "var(--radius-sm)",
                                border: "none",
                                background: "#10B981",
                                color: "#fff",
                                fontSize: 11,
                                fontWeight: 600,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 4,
                              }}
                            >
                              <Check size={14} /> Approve
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: 16 }}>
                    <button
                      onClick={() => setActiveModal(null)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--color-border)",
                        background: "transparent",
                        color: "var(--color-text-secondary)",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {/* 6. Audit & Reports */}
              {activeModal === "audit" && (
                <div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      {
                        title: "Consolidated Financial Audit",
                        desc: "Full balance sheet, profit/loss & reserve coverage (PDF)",
                        type: "PDF Report",
                      },
                      {
                        title: "Branch Operations & Revenue Ledger",
                        desc: "Branch collections, loan defaults & cash flows (CSV)",
                        type: "Excel / CSV",
                      },
                      {
                        title: "Member DPS & Savings Portfolio",
                        desc: "All active deposit contracts & dividend schedules (Excel)",
                        type: "Spreadsheet",
                      },
                    ].map((rep, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          success("Audit Downloaded", `${rep.title} generated & downloaded successfully!`);
                          setActiveModal(null);
                        }}
                        style={{
                          padding: "12px",
                          borderRadius: "var(--radius-md)",
                          background: "var(--color-surface-hover)",
                          border: "1px solid var(--color-border-subtle)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 10,
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-primary)" }}>
                            {rep.title}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{rep.desc}</div>
                        </div>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "6px 10px",
                            borderRadius: "var(--radius-sm)",
                            background: "var(--color-brand-soft)",
                            color: "var(--color-brand)",
                            fontSize: 11,
                            fontWeight: 600,
                            flexShrink: 0,
                          }}
                        >
                          <Download size={13} /> Export
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 16 }}>
                    <button
                      onClick={() => setActiveModal(null)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--color-border)",
                        background: "transparent",
                        color: "var(--color-text-secondary)",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

// ─── Role-specific home content ───────────────────────────────────────────────
const HomeContent: React.FC<{
  role: string;
  user: { name: string; balance?: number; workspace_name: string; role_color: string };
  onNavigateTab?: (tab: string) => void;
}> = ({ role, user, onNavigateTab }) => {
  const balance = user.balance ?? 0;
  const fmt = (n: number) => n.toLocaleString("en-BD");

  // Shared recent transactions (demo)
  const recentTxs = [
    { name: "Monthly Deposit", amount: "5,000", type: "in" as const, date: "Today, 10:30 AM" },
    { name: "Loan Disbursement", amount: "25,000", type: "out" as const, date: "Yesterday, 3:15 PM" },
    { name: "Member Contribution", amount: "2,500", type: "in" as const, date: "Nov 1, 9:00 AM" },
    { name: "Utility Payment", amount: "1,200", type: "out" as const, date: "Oct 30, 11:45 AM" },
  ];

  if (role === "founder") {
    return (
      <>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 20 }}>
          {/* 1. Total Branches */}
          <StatCard label="Total Branches" value="7" sub="2 pending" subType="warning" icon={<Building2 size={16} />} accent="#10B981" />
          {/* 2. Total Members */}
          <StatCard label="Total Members" value="1,248" sub="+12 this month" subType="success" icon={<Users size={16} />} accent="#0F5BE4" />
          {/* 3. Platform Value */}
          <StatCard label="Platform Value" value={`৳${fmt(balance)}`} sub="+14.2% growth" subType="success" icon={<Wallet size={16} />} accent="#9333EA" />
          {/* 4. Monthly Revenue */}
          <StatCard label="Monthly Revenue" value="৳3.2L" sub="+8.4% vs last" subType="success" icon={<TrendingUp size={16} />} accent="#EA580C" />
        </div>
        <ActionCenter role={role} onNavigateTab={onNavigateTab} />
      </>
    );
  }

  if (role === "admin") {
    return (
      <>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 20 }}>
          <StatCard label="HQ Balance" value={`৳${fmt(balance)}`} sub="Current" icon={<Wallet size={16} />} accent="#16A34A" />
          <StatCard label="Total Members" value="1,248" sub="+12 this month" icon={<Users size={16} />} accent="#0F5BE4" />
          <StatCard label="Pending Tasks" value="5" sub="Needs review" icon={<FileText size={16} />} accent="#EA580C" />
          <StatCard label="This Month" value="৳1.8L" sub="Collected" icon={<TrendingUp size={16} />} accent="#10B981" />
        </div>
        <SectionCard title="Recent Transactions">
          {recentTxs.map((tx, i) => <TxRow key={i} {...tx} />)}
        </SectionCard>
      </>
    );
  }

  if (role === "manager") {
    return (
      <>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 20 }}>
          <StatCard label="Branch Balance" value={`৳${fmt(balance)}`} sub={user.workspace_name} icon={<Building2 size={16} />} accent="#1D4ED8" />
          <StatCard label="Branch Members" value="186" sub="+3 this week" icon={<Users size={16} />} accent="#0F5BE4" />
          <StatCard label="Collections" value="৳42,500" sub="This month" icon={<TrendingUp size={16} />} accent="#10B981" />
          <StatCard label="Pending Loans" value="8" sub="Review needed" icon={<FileText size={16} />} accent="#EA580C" />
        </div>
        <SectionCard title="Recent Transactions">
          {recentTxs.map((tx, i) => <TxRow key={i} {...tx} />)}
        </SectionCard>
      </>
    );
  }

  if (role === "cashier") {
    return (
      <>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
          <StatCard label="Today Collected" value="৳18,500" sub="12 transactions" icon={<BadgeDollarSign size={16} />} accent="#1D4ED8" />
          <StatCard label="Today Disbursed" value="৳9,000" sub="4 transactions" icon={<ArrowUpRight size={16} />} accent="#EA580C" />
          <StatCard label="Pending" value="3" sub="Awaiting approval" icon={<FileText size={16} />} accent="#F59E0B" />
        </div>
        <SectionCard title="Today's Transactions">
          {recentTxs.slice(0, 3).map((tx, i) => <TxRow key={i} {...tx} />)}
        </SectionCard>
      </>
    );
  }

  if (role === "investor") {
    return (
      <>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
          <StatCard label="Portfolio Value" value={`৳${fmt(balance)}`} sub="Total invested" icon={<PieChart size={16} />} accent="#EA580C" />
          <StatCard label="Monthly Return" value="৳8,500" sub="+12.4% ROI" icon={<TrendingUp size={16} />} accent="#10B981" />
          <StatCard label="Active Plans" value="2" sub="Running" icon={<Briefcase size={16} />} accent="#0F5BE4" />
        </div>
        <SectionCard title="Investment History">
          {recentTxs.map((tx, i) => <TxRow key={i} {...tx} />)}
        </SectionCard>
      </>
    );
  }

  // member (default)
  return (
    <>
      {/* Balance Card */}
      <div
        style={{
          background: "linear-gradient(135deg, #0F5BE4 0%, #041B45 100%)",
          borderRadius: "var(--radius-xl)",
          padding: "24px 20px",
          marginBottom: 20,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>My Savings Balance</div>
        <div style={{ fontSize: 32, fontWeight: 700, color: "#fff", fontFamily: "var(--font-heading)", marginBottom: 4 }}>
          ৳{fmt(balance)}
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{user.workspace_name}</div>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <StatCard label="This Month" value="৳5,000" sub="Deposited" icon={<ArrowDownLeft size={16} />} accent="#10B981" />
        <StatCard label="Total Saved" value={`৳${fmt(balance)}`} sub="Lifetime" icon={<Wallet size={16} />} accent="#0F5BE4" />
      </div>
      <SectionCard title="My Transactions">
        {recentTxs.map((tx, i) => <TxRow key={i} {...tx} />)}
      </SectionCard>
    </>
  );
};

// ─── Section Card wrapper ─────────────────────────────────────────────────────
const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div
    style={{
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-lg)",
      padding: "16px",
      marginBottom: 16,
    }}
  >
    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      {title}
      <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-brand)", fontSize: 12, display: "flex", alignItems: "center", gap: 2 }}>
        See all <ChevronRight size={12} />
      </button>
    </div>
    {children}
  </div>
);

// ─── Placeholder content for other tabs ──────────────────────────────────────
const PlaceholderContent: React.FC<{ tab: string }> = ({ tab }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "60px 24px",
      gap: 12,
      color: "var(--color-text-muted)",
      textAlign: "center",
    }}
  >
    <div style={{ fontSize: 40 }}>🚧</div>
    <div style={{ fontSize: 16, fontWeight: 600, color: "var(--color-text-secondary)" }}>Coming Soon</div>
    <div style={{ fontSize: 13 }}>
      The <strong>{tab}</strong> section is being built.
    </div>
  </div>
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export const DashboardPage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState("home");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // ── Sliding pill refs & state ──
  const navRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });

  // Measure only when activeTab changes — avoids infinite render loop
  useLayoutEffect(() => {
    const role = currentUser?.role ?? "member";
    const items = NAV_BY_ROLE[role] ?? NAV_BY_ROLE.member;
    const idx = items.findIndex((n) => n.id === activeTab);
    const btn = btnRefs.current[idx];
    const nav = navRef.current;
    if (!btn || !nav) return;
    const navRect = nav.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setPill({ left: btnRect.left - navRect.left, width: btnRect.width, ready: true });
  }, [activeTab, currentUser?.role]); // ← dependency array stops infinite loop

  if (!currentUser) return null;

  const navItems = NAV_BY_ROLE[currentUser.role] ?? NAV_BY_ROLE.member;
  const activeNavItem = navItems.find((n) => n.id === activeTab) ?? navItems[0];

  // ── Dynamic time greeting & date (live updating) ──
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const hour = currentTime.getHours();
  let timeOfDay = "Evening";
  let greetingWord = "Good evening,";
  let timeIcon: React.ReactNode = null;

  if (hour >= 5 && hour < 12) {
    timeOfDay = language === "bn" ? "সকাল" : "Morning";
    greetingWord = language === "bn" ? "শুভ সকাল," : "Good morning,";
    timeIcon = (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
    );
  } else if (hour >= 12 && hour < 17) {
    timeOfDay = language === "bn" ? "দুপুর" : "Afternoon";
    greetingWord = language === "bn" ? "শুভ দুপুর," : "Good afternoon,";
    timeIcon = (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00C2FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2" />
        <path d="M12 21v2" />
        <path d="M4.22 4.22l1.42 1.42" />
        <path d="M18.36 18.36l1.42 1.42" />
        <path d="M1 12h2" />
        <path d="M21 12h2" />
        <path d="M4.22 19.78l1.42-1.42" />
        <path d="M18.36 5.64l1.42-1.42" />
      </svg>
    );
  } else if (hour >= 17 && hour < 21) {
    timeOfDay = language === "bn" ? "সন্ধ্যা" : "Evening";
    greetingWord = language === "bn" ? "শুভ সন্ধ্যা," : "Good evening,";
    timeIcon = (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4" />
        <path d="m4.93 10.93 2.83-2.83" />
        <path d="m19.07 10.93-2.83-2.83" />
        <path d="M2 18h20" />
        <path d="M16 18a4 4 0 0 0-8 0" />
      </svg>
    );
  } else {
    timeOfDay = language === "bn" ? "রাত" : "Night";
    greetingWord = language === "bn" ? "শুভ রাত্রি," : "Good night,";
    timeIcon = (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    );
  }

  const formattedDate = currentTime.toLocaleDateString(language === "bn" ? "bn-BD" : "en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const displayName = currentUser.login_id === "aye01" ? "Aeysha Shahriyar" : currentUser.name;

  const roleBadgeMap: Record<string, { label: string; labelBn: string; color: string; border: string; bg: string; icon: React.ReactNode }> = {
    founder: {
      label: "Platform Founder",
      labelBn: "প্ল্যাটফর্ম প্রতিষ্ঠাতা",
      color: "#E879F9",
      border: "rgba(217, 70, 239, 0.45)",
      bg: "rgba(217, 70, 239, 0.12)",
      icon: <Crown size={13} />,
    },
    admin: {
      label: "System Admin",
      labelBn: "সিস্টেম অ্যাডমিন",
      color: "#4ADE80",
      border: "rgba(74, 222, 128, 0.45)",
      bg: "rgba(74, 222, 128, 0.12)",
      icon: <Shield size={13} />,
    },
    manager: {
      label: "Branch Manager",
      labelBn: "শাখা ব্যবস্থাপক",
      color: "#60A5FA",
      border: "rgba(96, 165, 250, 0.45)",
      bg: "rgba(96, 165, 250, 0.12)",
      icon: <Briefcase size={13} />,
    },
    cashier: {
      label: "Cashier Officer",
      labelBn: "ক্যাশ কর্মকর্তা",
      color: "#38BDF8",
      border: "rgba(56, 189, 248, 0.45)",
      bg: "rgba(56, 189, 248, 0.12)",
      icon: <BadgeDollarSign size={13} />,
    },
    investor: {
      label: "Key Investor",
      labelBn: "বিনিয়োগকারী",
      color: "#FB923C",
      border: "rgba(251, 146, 60, 0.45)",
      bg: "rgba(251, 146, 60, 0.12)",
      icon: <TrendingUp size={13} />,
    },
    member: {
      label: "Verified Member",
      labelBn: "যাচাইকৃত সদস্য",
      color: "#94A3B8",
      border: "rgba(148, 163, 184, 0.45)",
      bg: "rgba(148, 163, 184, 0.12)",
      icon: <UserCheck size={13} />,
    },
  };

  const currentRoleBadge = roleBadgeMap[currentUser.role] ?? roleBadgeMap.member;
  const accessBadge = {
    label: currentUser.scope === "system" ? "Full Access" : "Branch Access",
    labelBn: currentUser.scope === "system" ? "পূর্ণ অ্যাক্সেস" : "শাখা অ্যাক্সেস",
  };

  return (
    <div
      className="mobile-shell"
      style={{ background: "var(--color-bg)", display: "flex", flexDirection: "column", height: "100dvh", overflow: "hidden" }}
    >
      {/* ── Top Header ── */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          background: "transparent",
          flexShrink: 0,
          zIndex: 20,
          position: "relative",
        }}
      >
        {/* Left: Logo SVG + brand text in Caviler font */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Inline SVG from Logo component */}
          <svg
            viewBox="0 0 5000 4008"
            width={28}
            height={28}
            style={{
              filter: theme === "dark"
                ? "drop-shadow(0 0 10px rgba(15,91,228,0.6))"
                : "drop-shadow(0 2px 6px rgba(15,91,228,0.3))",
              flexShrink: 0,
            }}
          >
            <defs>
              <linearGradient id="hdr-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0F5BE4" />
                <stop offset="100%" stopColor="#6BBCE9" />
              </linearGradient>
            </defs>
            <path
              fill="url(#hdr-logo-grad)"
              d="M3886 750.5h327.8c115.6 0 220.8 47.4 297.1 123.6l.3.3c76.2 76.3 123.6 181.5 123.6 297.1v723.8h224.9c40.7 0 73.8 33.1 73.8 73.8v1014.4c0 40.7-33.1 73.7-73.8 73.7h-224.9v467.1c0 115.7-47.4 220.9-123.6 297.2l-.3.2c-76.3 76.3-181.5 123.7-297.1 123.7H487c-115.7 0-220.9-47.4-297.1-123.7l-.3-.2C113.4 3745.2 66 3640 66 3524.3V477c0-113.8 45.9-217.5 120-293.5 72.4-74.1 171.9-121.9 282.1-126.8 3.4-.4 6.9-.7 10.4-.7H3465c115.6 0 220.9 47.4 297.1 123.6l.3.3C3838.6 256.2 3886 361.4 3886 477zM487 898l-8.8-.1-2.4-.1c-93.6-2.4-179.9-36-248.9-90.5l-.9-.8-2.1-1.6-1.8-1.5-6.1-5-2.1-1.8-.4-.3v2728c0 75.3 30.8 143.7 80.3 193.3 49.5 49.4 117.9 80.2 193.2 80.2h3726.8c75.2 0 143.7-30.8 193.2-80.2 49.5-49.6 80.3-118 80.3-193.3v-467.1h-645.1c-26.7 0-50-14.2-63-35.4l-177.8-249.3-179.9-252.2q-2.1-2.85-3.9-5.7l-1-1.7-1-1.9-.1-.2-1.4-2.7-1.7-4-.5-1.1-1.5-4.2-.1-.3-.4-1.4v-.1c-1.5-4.9-2.4-9.9-2.8-15l-.2-3.4-.1-2.4.1-2.3.2-3.5c.4-5 1.3-10 2.8-15l.4-1.5.1-.2 1.5-4.3.5-1.1 1.7-3.9 1.4-2.7.1-.3 1-1.9 1-1.6q1.8-3 3.9-5.7l179.9-252.2 177.8-249.3c13-21.2 36.3-35.4 63-35.4h645.1v-723.8c0-75.2-30.8-143.7-80.3-193.2S4289 898 4213.8 898zM282.1 657.9l.9.9.2.3 1.7 1.8 3.7 4.1.9.9 1.9 2 2.3 2.3.6.6 6.6 6.3 1.5 1.4 1.2 1.1.3.3c46.8 42.2 108.1 68.6 175.5 70.5h3259.1V477c0-75.3-30.8-143.7-80.3-193.3-49.5-49.4-117.9-80.2-193.2-80.2H478.5v-.1c-73 2.2-139.1 33.5-187.1 82.7-48.1 49.3-77.9 116.8-77.9 190.9 0 69.2 26 132.6 68.6 180.9M4561 2042.8h-681.1l-158.7 222.5-150.4 210.9 150.4 211 158.7 222.5h906v-866.9zm-1139.5 389.4c4.5-6 9.9-11.4 16.3-15.9zm662.8-183.4c62.8 0 119.7 25.5 160.9 66.6 41.1 41.2 66.6 98.1 66.6 160.9s-25.5 119.7-66.6 160.8c-41.2 41.2-98.1 66.7-160.9 66.7s-119.7-25.5-160.8-66.7q-2.4-2.4-4.6-4.9c-38.5-40.8-62.1-95.8-62.1-155.9 0-62.6 25.5-119.4 66.8-160.7l-.1-.2c41.1-41.1 98-66.6 160.8-66.6m56.6 170.9a79.97 79.97 0 0 0-56.6-23.4c-22.1 0-42.1 9-56.6 23.4l-.1-.2-.1.2c-14.4 14.3-23.2 34.3-23.2 56.6 0 20.9 7.8 39.8 20.6 53.9l2.8 2.7c14.5 14.4 34.5 23.4 56.6 23.4s42.2-9 56.6-23.4c14.4-14.5 23.4-34.5 23.4-56.6s-9-42.2-23.4-56.6"
            />
          </svg>

          {/* Brand name in Caviler logo font */}
          <span
            style={{
              fontFamily: "var(--font-logo)",
              fontSize: 20,
              fontWeight: 400,
              letterSpacing: "0.04em",
              lineHeight: 1,
              userSelect: "none",
              color: "var(--color-text-primary)",
            }}
          >
            Digital{" "}
            <span style={{ color: "var(--color-brand)" }}>Somity</span>
          </span>
        </div>

        {/* Right: Avatar + Name + Role + Chevron → opens profile dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 6px",
              borderRadius: "var(--radius-lg)",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                overflow: "hidden",
                border: `2px solid ${currentUser.role_color}`,
                flexShrink: 0,
                background: currentUser.role_color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {currentUser.avatar_url ? (
                <img
                  src={currentUser.avatar_url}
                  alt={currentUser.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                currentUser.initial
              )}
            </div>

            {/* Name + Role */}
            <div style={{ textAlign: "left", lineHeight: 1.25 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-primary)", whiteSpace: "nowrap" }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: 11, color: currentUser.role_color, fontWeight: 500, whiteSpace: "nowrap" }}>
                {currentUser.role_name_en}
              </div>
            </div>

            {/* Chevron */}
            <motion.span
              animate={{ rotate: profileOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: "flex", color: "var(--color-text-muted)", flexShrink: 0 }}
            >
              <ChevronRight size={14} style={{ transform: "rotate(90deg)" }} />
            </motion.span>
          </button>

          {/* ── Profile Dropdown ── */}
          <AnimatePresence>
            {profileOpen && (
              <>
                {/* Click-away backdrop */}
                <div
                  onClick={() => setProfileOpen(false)}
                  style={{ position: "fixed", inset: 0, zIndex: 28 }}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -8 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    minWidth: 200,
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-lg)",
                    boxShadow: "var(--shadow-modal)",
                    zIndex: 29,
                    overflow: "hidden",
                  }}
                >
                  {/* Profile header */}
                  <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--color-border)" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-primary)" }}>{currentUser.name}</div>
                    <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 2 }}>{currentUser.email}</div>
                    <div style={{ marginTop: 6 }}>
                      <RoleIcon role={currentUser.role} color={currentUser.role_color} />
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div style={{ padding: "6px" }}>
                    <DropdownItem icon={<Globe size={15} />} label={language === "bn" ? "English" : "বাংলা"} onClick={() => { toggleLanguage(); setProfileOpen(false); }} />
                    <DropdownItem icon={theme === "dark" ? <Sun size={15} /> : <Moon size={15} />} label={theme === "dark" ? "Light Mode" : "Dark Mode"} onClick={() => { toggleTheme(); setProfileOpen(false); }} />
                    <DropdownItem icon={<Settings size={15} />} label="Settings" onClick={() => setProfileOpen(false)} />
                  </div>

                  {/* Logout */}
                  <div style={{ padding: "6px", borderTop: "1px solid var(--color-border)" }}>
                    <DropdownItem
                      icon={<LogOut size={15} />}
                      label="Log Out"
                      danger
                      onClick={() => { logout(); setProfileOpen(false); }}
                    />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main
        className="no-scrollbar"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          paddingBottom: "calc(88px + env(safe-area-inset-bottom, 0px))",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {activeTab === "home" ? (
          <>
            {/* ── Hero Greeting Banner (Borderless & Well-Spaced) ── */}
            <div style={{ marginBottom: 28, paddingTop: 8, paddingLeft: 2, paddingRight: 2 }}>
              {/* 1. Time of Day + Date Row */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, fontSize: 13 }}>
                {/* Dynamic Time of Day Icon */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  {timeIcon}
                </div>
                <span style={{ fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.01em" }}>
                  {timeOfDay}
                </span>
                <span style={{ color: "var(--color-text-muted)", opacity: 0.35, margin: "0 2px" }}>|</span>
                <span style={{ color: "var(--color-text-muted)", fontWeight: 500, fontSize: 13 }}>
                  {formattedDate}
                </span>
              </div>

              {/* 2. Main Greeting Headline */}
              <div style={{ marginBottom: 18 }}>
                <h1
                  style={{
                    fontSize: "clamp(22px, 5.5vw, 26px)",
                    fontWeight: 700,
                    color: "var(--color-text-primary)",
                    margin: 0,
                    lineHeight: 1.25,
                    letterSpacing: "-0.02em",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {greetingWord}
                </h1>
                <div
                  style={{
                    fontSize: "clamp(28px, 7.5vw, 36px)",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.2,
                    fontFamily: "var(--font-heading)",
                    background: "linear-gradient(90deg, #00B4D8 0%, #00F5D4 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginTop: 4,
                  }}
                >
                  {displayName}!
                </div>
              </div>

              {/* 3. Badges Row */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
                {/* Role Badge */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "6px 14px",
                    borderRadius: 999,
                    border: `1px solid ${currentRoleBadge.border}`,
                    background: currentRoleBadge.bg,
                    color: currentRoleBadge.color,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {currentRoleBadge.icon}
                  <span>{language === "bn" ? currentRoleBadge.labelBn : currentRoleBadge.label}</span>
                </div>

                <span style={{ color: "var(--color-text-muted)", opacity: 0.35 }}>|</span>

                {/* Access Badge */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "6px 14px",
                    borderRadius: 999,
                    border: "1px solid rgba(56, 189, 248, 0.45)",
                    background: "rgba(56, 189, 248, 0.12)",
                    color: "#38BDF8",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  <ShieldCheck size={14} />
                  <span>{language === "bn" ? accessBadge.labelBn : accessBadge.label}</span>
                </div>
              </div>

              {/* 4. Bottom Welcome + Glow Bar */}
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 13.5, color: "var(--color-text-muted)", fontWeight: 500, letterSpacing: "-0.01em" }}>
                  Welcome to Digital Somity
                </span>
                <div
                  style={{
                    height: 3.5,
                    width: 84,
                    borderRadius: 999,
                    background: "linear-gradient(90deg, #00B4D8 0%, #00F5D4 70%, transparent 100%)",
                    boxShadow: "0 0 10px rgba(0, 180, 216, 0.55)",
                  }}
                />
              </div>
            </div>

            <HomeContent role={currentUser.role} user={currentUser} onNavigateTab={(t) => setActiveTab(t)} />
          </>
        ) : (
          <>
            {/* Page title for other tabs */}
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: "var(--size-section-heading)", fontWeight: 700, color: "var(--color-text-primary)", margin: 0 }}>
                {language === "bn" ? activeNavItem.labelBn : activeNavItem.label}
              </h2>
              <p style={{ fontSize: 12, color: "var(--color-text-muted)", margin: "2px 0 0" }}>
                {currentUser.workspace_name}
              </p>
            </div>
            <PlaceholderContent tab={language === "bn" ? activeNavItem.labelBn : activeNavItem.label} />
          </>
        )}
      </main>

      {/* ── Bottom Navigation (Floating & Glass Transparent) ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "10px 16px",
          paddingBottom: "calc(14px + env(safe-area-inset-bottom, 0px))",
          background: "transparent",
          zIndex: 25,
          pointerEvents: "none",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          ref={navRef}
          style={{
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            background: theme === "dark" ? "rgba(10, 10, 16, 0.68)" : "rgba(255, 255, 255, 0.72)",
            backdropFilter: "blur(24px) saturate(190%)",
            WebkitBackdropFilter: "blur(24px) saturate(190%)",
            border: theme === "dark" ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid rgba(0, 0, 0, 0.08)",
            borderRadius: 999,
            padding: "6px 6px",
            boxShadow: theme === "dark"
              ? "0 16px 40px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)"
              : "0 14px 35px rgba(4, 27, 69, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04)",
            position: "relative",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* ── Single sliding pill (Accent Color) ── */}
          <motion.div
            animate={{
              left: pill.left,
              width: pill.width,
              opacity: pill.ready ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 440, damping: 38, mass: 0.9 }}
            style={{
              position: "absolute",
              top: 6,
              height: "calc(100% - 12px)",
              borderRadius: 999,
              background: "var(--color-brand)",
              boxShadow: "0 4px 16px var(--color-brand-glow)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          {/* ── Tab buttons ── */}
          {navItems.map((item, idx) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                ref={(el) => { btnRefs.current[idx] = el; }}
                onClick={() => setActiveTab(item.id)}
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: isActive ? 8 : 0,
                  padding: isActive ? "10px 18px" : "10px 11px",
                  border: "none",
                  borderRadius: 999,
                  background: "transparent",
                  color: isActive ? "#FFFFFF" : "var(--color-text-muted)",
                  cursor: "pointer",
                  flexShrink: isActive ? 0 : 1,
                  whiteSpace: "nowrap",
                  minWidth: 0,
                  transition: "color 180ms ease",
                  outline: "none",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {/* Icon */}
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    width: 22,
                    height: 22,
                    color: isActive ? "#FFFFFF" : "currentColor",
                    transition: "color 180ms ease",
                  }}
                >
                  {item.icon}
                </span>

                {/* Label */}
                {isActive && (
                  <span
                    style={{
                      fontSize: 13.5,
                      fontWeight: 700,
                      letterSpacing: "-0.01em",
                      whiteSpace: "nowrap",
                      color: "#FFFFFF",
                    }}
                  >
                    {language === "bn" ? item.labelBn : item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Side Drawer (Menu) ── */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "var(--overlay-bg)",
              zIndex: 40,
            }}
          />
          {/* Drawer */}
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "72%",
              maxWidth: 280,
              background: "var(--color-surface)",
              borderLeft: "1px solid var(--color-border)",
              zIndex: 50,
              display: "flex",
              flexDirection: "column",
              padding: "0 0 24px",
            }}
          >
            {/* Drawer header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 15, color: "var(--color-text-primary)", fontFamily: "var(--font-heading)" }}>
                Menu
              </span>
              <IconBtn onClick={() => setDrawerOpen(false)}>
                <X size={18} />
              </IconBtn>
            </div>

            {/* Profile summary */}
            <div style={{ padding: "16px", borderBottom: "1px solid var(--color-border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: `2px solid ${currentUser.role_color}`,
                    background: currentUser.role_color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {currentUser.avatar_url ? (
                    <img src={currentUser.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    currentUser.initial
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "var(--color-text-primary)" }}>{currentUser.name}</div>
                  <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{currentUser.login_id}</div>
                  <RoleIcon role={currentUser.role} color={currentUser.role_color} />
                </div>
              </div>
            </div>

            {/* Nav links */}
            <div
              className="no-scrollbar"
              style={{
                flex: 1,
                padding: "8px 8px",
                overflowY: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setDrawerOpen(false); }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 12px",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    background: activeTab === item.id ? "var(--color-brand-soft)" : "none",
                    color: activeTab === item.id ? "var(--color-brand)" : "var(--color-text-secondary)",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: activeTab === item.id ? 600 : 400,
                    textAlign: "left",
                    marginBottom: 2,
                  }}
                >
                  {item.icon}
                  {language === "bn" ? item.labelBn : item.label}
                </button>
              ))}
            </div>

            {/* Logout */}
            <div style={{ padding: "0 8px" }}>
              <button
                onClick={() => { logout(); setDrawerOpen(false); }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 12px",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-error-soft)",
                  color: "var(--color-error)",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                <LogOut size={18} />
                {language === "bn" ? "লগ আউট" : "Log Out"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ─── Small icon button helper ─────────────────────────────────────────────────
const IconBtn: React.FC<{ children: React.ReactNode; onClick?: () => void; title?: string }> = ({
  children,
  onClick,
  title,
}) => (
  <button
    onClick={onClick}
    title={title}
    style={{
      width: 36,
      height: 36,
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-md)",
      background: "var(--color-surface-hover)",
      color: "var(--color-text-secondary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      flexShrink: 0,
    }}
  >
    {children}
  </button>
);

// ─── Dropdown menu item ───────────────────────────────────────────────────────
const DropdownItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  danger?: boolean;
}> = ({ icon, label, onClick, danger }) => (
  <button
    onClick={onClick}
    style={{
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "9px 10px",
      border: "none",
      borderRadius: "var(--radius-md)",
      background: "none",
      color: danger ? "var(--color-error)" : "var(--color-text-secondary)",
      cursor: "pointer",
      fontSize: 13,
      fontWeight: 500,
      textAlign: "left",
    }}
  >
    {icon}
    {label}
  </button>
);

export default DashboardPage;

