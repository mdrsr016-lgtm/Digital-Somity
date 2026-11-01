import React from "react";
import { X, Sparkles, Sun, Moon } from "lucide-react";
import { useToast, ToastType, ToastAction } from "../../contexts/ToastContext";
import { useTheme } from "../../contexts/ThemeContext";

interface ShowcaseItem {
  id: string;
  type: ToastType;
  title: string;
  subtitle: string;
  category: string;
  action?: ToastAction;
}

export const ALL_POSSIBLE_CARDS: ShowcaseItem[] = [
  // 1. Standard Core Notifications (The Canonical 4)
  {
    id: "core-success",
    type: "success",
    title: "Success",
    subtitle: "Your changes have been saved successfully.",
    category: "⭐ Standard Core Notifications",
  },
  {
    id: "core-error",
    type: "error",
    title: "Error",
    subtitle: "An unexpected error occurred. Please try again.",
    category: "⭐ Standard Core Notifications",
  },
  {
    id: "core-warning",
    type: "warning",
    title: "Warning",
    subtitle: "Unsaved changes will be lost if you navigate away.",
    category: "⭐ Standard Core Notifications",
  },
  {
    id: "core-info",
    type: "info",
    title: "Info",
    subtitle: "Scheduled maintenance will occur tonight at 02:00 AM.",
    category: "⭐ Standard Core Notifications",
  },

  // 2. Financial & Transactions (Success & Cautions)
  {
    id: "payment-processed",
    type: "success",
    title: "Payment processed",
    subtitle: "Transaction ID: #14402",
    category: "Financial & Transactions",
  },
  {
    id: "deposit-received",
    type: "success",
    title: "Deposit credited",
    subtitle: "৳ 10,000 received into General Savings",
    category: "Financial & Transactions",
  },
  {
    id: "loan-disbursed",
    type: "success",
    title: "Loan disbursed",
    subtitle: "৳ 50,000 transferred to Member #MBR-018",
    category: "Financial & Transactions",
  },
  {
    id: "withdraw-approved",
    type: "success",
    title: "Cash withdrawal approved",
    subtitle: "৳ 5,000 disbursed across counter",
    category: "Financial & Transactions",
  },
  {
    id: "payment-due",
    type: "warning",
    title: "Installment due today",
    subtitle: "Loan #LN-409 payment of ৳ 2,500 pending",
    category: "Financial & Transactions",
    action: { label: "Pay Now", onClick: () => alert("Opening payment checkout...") },
  },
  {
    id: "low-reserve",
    type: "warning",
    title: "Low vault reserve",
    subtitle: "Branch physical cash balance below ৳ 50,000 threshold",
    category: "Financial & Transactions",
  },
  {
    id: "limit-reached",
    type: "error",
    title: "Withdrawal limit reached",
    subtitle: "Maximum daily limit of ৳ 25,000 exceeded for this branch",
    category: "Financial & Transactions",
  },

  // 3. Member & Data Operations (with Undo & Copy)
  {
    id: "changes-saved",
    type: "success",
    title: "Changes saved",
    subtitle: "Member profile records updated successfully.",
    category: "Member & Data Operations",
  },
  {
    id: "record-deleted",
    type: "delete",
    title: "Record deleted",
    subtitle: "Member #MBR-022 removed from active registry.",
    category: "Member & Data Operations",
    action: { label: "Undo", onClick: () => alert("Record restored successfully!") },
  },
  {
    id: "copied-clipboard",
    type: "copied",
    title: "Copied to clipboard",
    subtitle: "Branch bank routing code copied to clipboard.",
    category: "Member & Data Operations",
  },
  {
    id: "kyc-approved",
    type: "success",
    title: "Application approved",
    subtitle: "National ID (NID) verification completed successfully.",
    category: "Member & Data Operations",
    action: { label: "View", onClick: () => alert("Opening member KYC file...") },
  },
  {
    id: "app-rejected",
    type: "error",
    title: "Request rejected",
    subtitle: "Micro-loan application did not meet eligibility criteria.",
    category: "Member & Data Operations",
    action: { label: "Details", onClick: () => alert("Viewing rejection reasons...") },
  },
  {
    id: "file-uploaded",
    type: "success",
    title: "File uploaded",
    subtitle: "Passbook audit scan uploaded successfully (1.4 MB).",
    category: "Member & Data Operations",
  },

  // 4. Security & Authentication
  {
    id: "auth-success",
    type: "success",
    title: "Authenticated successfully",
    subtitle: "Signed in as Administrator (adm00)",
    category: "Security & Authentication",
  },
  {
    id: "auth-failed",
    type: "error",
    title: "Authentication failed",
    subtitle: "Incorrect User ID or password (2 attempts left)",
    category: "Security & Authentication",
  },
  {
    id: "access-denied",
    type: "error",
    title: "Access denied",
    subtitle: "You do not have permission to perform administrative vault actions.",
    category: "Security & Authentication",
  },
  {
    id: "session-expired",
    type: "warning",
    title: "Session expired",
    subtitle: "Your active session timed out due to inactivity.",
    category: "Security & Authentication",
    action: { label: "Sign In", onClick: () => alert("Redirecting to login...") },
  },
  {
    id: "account-frozen",
    type: "security",
    title: "Account restricted",
    subtitle: "Account #MBR-004 is temporarily frozen by auditor",
    category: "Security & Authentication",
    action: { label: "Review", onClick: () => alert("Opening account audit history...") },
  },
  {
    id: "device-alert",
    type: "security",
    title: "New device detected",
    subtitle: "Sign-in registered from Chrome on Windows 11",
    category: "Security & Authentication",
    action: { label: "Verify", onClick: () => alert("Reviewing device session...") },
  },
  {
    id: "password-updated",
    type: "success",
    title: "Password updated",
    subtitle: "Your security credentials have been changed successfully.",
    category: "Security & Authentication",
  },

  // 5. System, Network & Connection Health
  {
    id: "conn-failed",
    type: "warning",
    title: "Connection failed",
    subtitle: "Check your Internet connection",
    category: "Network & Connection Health",
    action: { label: "Retry", onClick: () => alert("Reconnecting to Somiti cloud server...") },
  },
  {
    id: "conn-restored",
    type: "success",
    title: "Connection restored",
    subtitle: "Back online. Synchronizing pending offline transactions.",
    category: "Network & Connection Health",
  },
  {
    id: "update-available",
    type: "info",
    title: "Update available",
    subtitle: "Version 2.1.0 ready to install",
    category: "Network & Connection Health",
    action: { label: "Install", onClick: () => alert("Downloading update package...") },
  },
  {
    id: "maintenance",
    type: "info",
    title: "Scheduled maintenance",
    subtitle: "Cloud server synchronization tonight at 02:00 AM",
    category: "Network & Connection Health",
  },
  {
    id: "otp-sent",
    type: "info",
    title: "Security OTP dispatched",
    subtitle: "Verification code sent to +880 1712-345678",
    category: "Network & Connection Health",
  },

  // 6. Dividends & Profits (Dividend)
  {
    id: "dividend-credited",
    type: "dividend",
    title: "Yearly dividend disbursed",
    subtitle: "৳ 14,800 profit share credited to capital balance",
    category: "Dividends & Member Rewards",
    action: { label: "Receipt", onClick: () => alert("Generating profit dividend voucher...") },
  },
  {
    id: "monthly-profit",
    type: "dividend",
    title: "Monthly profit payout",
    subtitle: "৳ 3,250 earned from micro-enterprise investments",
    category: "Dividends & Member Rewards",
  },
  {
    id: "interest-credited",
    type: "dividend",
    title: "Savings interest credited",
    subtitle: "৳ 1,120 accrued 6-month profit added to passbook balance",
    category: "Dividends & Member Rewards",
  },

  // 7. Live Async Loading & Ledger Sync
  {
    id: "syncing-ledger",
    type: "loading",
    title: "Synchronizing branch ledger...",
    subtitle: "Applying 14 offline member transactions to cloud database",
    category: "Real-time Progress & Async Sync",
  },
  {
    id: "processing-payment",
    type: "loading",
    title: "Processing payment verification...",
    subtitle: "Awaiting cryptographic confirmation from central clearing",
    category: "Real-time Progress & Async Sync",
  },
];

interface NotificationShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationShowcaseModal: React.FC<NotificationShowcaseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  if (!isOpen) return null;

  const isDark = theme === "dark";

  // Group cards by category
  const categories = Array.from(new Set(ALL_POSSIBLE_CARDS.map((c) => c.category)));

  const handleTrigger = (card: ShowcaseItem) => {
    showToast(card.type, card.title, card.subtitle, card.action, 5000);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
        padding: "16px",
        boxSizing: "border-box",
      }}
      onClick={onClose}
    >
      <div
        className="fintech-card"
        style={{
          width: "100%",
          maxWidth: "600px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: isDark ? "#0A0B0E" : "#FFFFFF",
          borderRadius: "24px",
          border: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid #E5E7EB",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.85)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div
          style={{
            padding: "18px 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #F1F5F9",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                backgroundColor: "rgba(15, 91, 228, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-brand)",
              }}
            >
              <Sparkles size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: isDark ? "#FFFFFF" : "#111827", margin: 0 }}>
                All Notification Cards Catalog
              </h3>
              <p style={{ fontSize: "11px", color: isDark ? "#94A3B8" : "#64748B", margin: 0 }}>
                Click any card to trigger a live pop-up in the corner
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Quick Theme Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              style={{
                background: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
                border: "none",
                borderRadius: "var(--radius-full)",
                padding: "6px 10px",
                fontSize: "11px",
                color: isDark ? "#F8FAFC" : "#334155",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontWeight: 500,
              }}
              title="Toggle Theme to preview cards in Dark / Light mode"
            >
              {isDark ? <Sun size={13} style={{ color: "#F59E0B" }} /> : <Moon size={13} style={{ color: "var(--color-brand)" }} />}
              <span>{isDark ? "Light" : "Dark"}</span>
            </button>

            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                color: isDark ? "#94A3B8" : "#64748B",
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Catalog of All Cards */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 22px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {categories.map((category) => {
            const cards = ALL_POSSIBLE_CARDS.filter((c) => c.category === category);
            return (
              <div key={category}>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: "var(--color-brand)",
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--color-brand)" }} />
                  <span>{category}</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      onClick={() => handleTrigger(card)}
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "12px 18px",
                        borderRadius: "28px",
                        backgroundColor: isDark ? "#12141A" : "#FFFFFF",
                        border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.08)",
                        boxShadow: isDark
                          ? "0 4px 14px rgba(0, 0, 0, 0.6)"
                          : "0 4px 14px rgba(0, 0, 0, 0.05)",
                        transition: "transform 0.15s ease, border-color 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.borderColor = "var(--color-brand)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.borderColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)";
                      }}
                      title="Click to trigger live pop-up"
                    >
                      {/* Badge */}
                      {card.type === "success" && (
                        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" style={{ flexShrink: 0 }}>
                          <circle cx="17" cy="17" r="17" fill="#16A34A" />
                          <path d="M10.5 17.5 L14.5 21.5 L23.5 12.5" stroke="#FFFFFF" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      {card.type === "warning" && (
                        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" style={{ flexShrink: 0 }}>
                          <path d="M17 4.5 L31.5 29 C32.2 30.2 31.3 31.5 30 31.5 L4 31.5 C2.7 31.5 1.8 30.2 2.5 29 L17 4.5 Z" fill="#F59E0B" />
                          <rect x="15.5" y="13.5" width="3" height="9" rx="1.5" fill="#FFFFFF" />
                          <circle cx="17" cy="26.5" r="1.6" fill="#FFFFFF" />
                        </svg>
                      )}
                      {card.type === "info" && (
                        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" style={{ flexShrink: 0 }}>
                          <circle cx="17" cy="17" r="17" fill="#2563EB" />
                          <rect x="15.5" y="10" width="3" height="10.5" rx="1.5" fill="#FFFFFF" />
                          <circle cx="17" cy="24.5" r="1.6" fill="#FFFFFF" />
                        </svg>
                      )}
                      {card.type === "error" && (
                        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" style={{ flexShrink: 0 }}>
                          <path d="M11 3.5 L23 3.5 L31.5 12 L31.5 24 L23 32.5 L11 32.5 L2.5 24 L2.5 12 Z" fill="#DC2626" />
                          <rect x="15.5" y="10" width="3" height="10.5" rx="1.5" fill="#FFFFFF" />
                          <circle cx="17" cy="24.5" r="1.6" fill="#FFFFFF" />
                        </svg>
                      )}
                      {card.type === "security" && (
                        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" style={{ flexShrink: 0 }}>
                          <path d="M17 3 L29 7.5 V16 C29 23.5 23.8 29.5 17 31.5 C10.2 29.5 5 23.5 5 16 V7.5 L17 3 Z" fill="#0284C7" />
                          <rect x="12" y="16" width="10" height="8" rx="2" fill="#FFFFFF" />
                          <path d="M14 16 V13 C14 11.3 15.3 10 17 10 C18.7 10 20 11.3 20 13 V16" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                          <circle cx="17" cy="20" r="1.2" fill="#0284C7" />
                        </svg>
                      )}
                      {card.type === "dividend" && (
                        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" style={{ flexShrink: 0 }}>
                          <circle cx="17" cy="17" r="17" fill="#8B5CF6" />
                          <path d="M17 8 Q17 17 26 17 Q17 17 17 26 Q17 17 8 17 Q17 17 17 8 Z" fill="#FFFFFF" />
                        </svg>
                      )}
                      {card.type === "delete" && (
                        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" style={{ flexShrink: 0 }}>
                          <circle cx="17" cy="17" r="17" fill="#E11D48" />
                          <path
                            d="M11 13 L23 13 M14 13 V23 C14 24 15 25 16 25 H18 C19 25 20 24 20 23 V13 M15 13 V10 C15 9.5 15.5 9 16 9 H18 C18.5 9 19 9.5 19 10 V13"
                            stroke="#FFFFFF"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                      {card.type === "copied" && (
                        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" style={{ flexShrink: 0 }}>
                          <circle cx="17" cy="17" r="17" fill="#0D9488" />
                          <rect x="13" y="13" width="10" height="12" rx="2" stroke="#FFFFFF" strokeWidth="2" fill="none" />
                          <path
                            d="M11 21 H10 C9 21 8 20 8 19 V11 C8 10 9 9 10 9 H18 C19 9 20 10 20 11 V12"
                            stroke="#FFFFFF"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                      {card.type === "loading" && (
                        <div
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "50%",
                            backgroundColor: "var(--color-brand)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <span style={{ color: "#FFF", fontSize: "14px" }}>◌</span>
                        </div>
                      )}

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "14px", fontWeight: 600, color: isDark ? "#F8FAFC" : "#1F2937" }}>
                          {card.title}
                        </div>
                        <div style={{ fontSize: "12px", color: isDark ? "#94A3B8" : "#64748B", marginTop: "2px" }}>
                          {card.subtitle}
                        </div>
                      </div>

                      {/* Action Button preview */}
                      {card.action && (
                        <div
                          style={{
                            padding: "4px 10px",
                            borderRadius: "var(--radius-full)",
                            fontSize: "11px",
                            fontWeight: 600,
                            backgroundColor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(15, 91, 228, 0.08)",
                            color: isDark ? "#FFFFFF" : "var(--color-brand)",
                            border: isDark ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid rgba(15, 91, 228, 0.25)",
                            flexShrink: 0,
                          }}
                        >
                          {card.action.label}
                        </div>
                      )}

                      {/* Trigger Pill badge */}
                      <div
                        style={{
                          fontSize: "10px",
                          fontWeight: 600,
                          color: "var(--color-brand)",
                          backgroundColor: "rgba(15, 91, 228, 0.1)",
                          padding: "3px 8px",
                          borderRadius: "var(--radius-full)",
                          flexShrink: 0,
                        }}
                      >
                        Pop Up ↗
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 22px",
            borderTop: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #F1F5F9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "11px", color: isDark ? "#94A3B8" : "#64748B" }}>
            Total {ALL_POSSIBLE_CARDS.length} unique fintech notification card patterns
          </span>
          <button
            onClick={onClose}
            className="btn-primary"
            style={{ padding: "8px 18px", fontSize: "12px", borderRadius: "var(--radius-full)" }}
          >
            Close Gallery
          </button>
        </div>
      </div>
    </div>
  );
};

