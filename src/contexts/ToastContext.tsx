import React, { createContext, useContext, useState, useCallback } from "react";
import { X, Loader2 } from "lucide-react";
import { useTheme } from "./ThemeContext";

export type ToastType =
  | "success"
  | "warning"
  | "info"
  | "error"
  | "security"
  | "dividend"
  | "delete"
  | "copied"
  | "loading";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: ToastAction;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (
    type: ToastType,
    title: string,
    message?: string,
    action?: ToastAction,
    duration?: number
  ) => string;
  removeToast: (id: string) => void;
  success: (title: string, message?: string, action?: ToastAction, duration?: number) => string;
  warning: (title: string, message?: string, action?: ToastAction, duration?: number) => string;
  info: (title: string, message?: string, action?: ToastAction, duration?: number) => string;
  error: (title: string, message?: string, action?: ToastAction, duration?: number) => string;
  security: (title: string, message?: string, action?: ToastAction, duration?: number) => string;
  dividend: (title: string, message?: string, action?: ToastAction, duration?: number) => string;
  deleted: (title: string, message?: string, action?: ToastAction, duration?: number) => string;
  copied: (title: string, message?: string, action?: ToastAction, duration?: number) => string;
  loading: (title: string, message?: string) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// ==========================================
// BADGE ICONS MATCHING THE REFERENCE DESIGN
// ==========================================

// 1. Success Badge: Green Circle with Bold Checkmark
const SuccessBadge = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="17" cy="17" r="17" fill="#16A34A" />
    <path
      d="M10.5 17.5 L14.5 21.5 L23.5 12.5"
      stroke="#FFFFFF"
      strokeWidth="2.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 2. Warning Badge: Amber Triangle with Exclamation Point
const WarningBadge = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" style={{ flexShrink: 0 }}>
    <path
      d="M17 4.5 L31.5 29 C32.2 30.2 31.3 31.5 30 31.5 L4 31.5 C2.7 31.5 1.8 30.2 2.5 29 L17 4.5 Z"
      fill="#F59E0B"
    />
    <rect x="15.5" y="13.5" width="3" height="9" rx="1.5" fill="#FFFFFF" />
    <circle cx="17" cy="26.5" r="1.6" fill="#FFFFFF" />
  </svg>
);

// 3. Info Badge: Royal Blue Circle with Exclamation Point
const InfoBadge = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="17" cy="17" r="17" fill="#2563EB" />
    <rect x="15.5" y="10" width="3" height="10.5" rx="1.5" fill="#FFFFFF" />
    <circle cx="17" cy="24.5" r="1.6" fill="#FFFFFF" />
  </svg>
);

// 4. Error Badge: Red Octagon with Exclamation Point
const ErrorBadge = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" style={{ flexShrink: 0 }}>
    <path
      d="M11 3.5 L23 3.5 L31.5 12 L31.5 24 L23 32.5 L11 32.5 L2.5 24 L2.5 12 Z"
      fill="#DC2626"
    />
    <rect x="15.5" y="10" width="3" height="10.5" rx="1.5" fill="#FFFFFF" />
    <circle cx="17" cy="24.5" r="1.6" fill="#FFFFFF" />
  </svg>
);

// 5. Security / Frozen Account Badge: Deep Cyan/Indigo Shield
const SecurityBadge = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" style={{ flexShrink: 0 }}>
    <path
      d="M17 3 L29 7.5 V16 C29 23.5 23.8 29.5 17 31.5 C10.2 29.5 5 23.5 5 16 V7.5 L17 3 Z"
      fill="#0284C7"
    />
    {/* Keyhole / Lock */}
    <rect x="12" y="16" width="10" height="8" rx="2" fill="#FFFFFF" />
    <path d="M14 16 V13 C14 11.3 15.3 10 17 10 C18.7 10 20 11.3 20 13 V16" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    <circle cx="17" cy="20" r="1.2" fill="#0284C7" />
  </svg>
);

// 6. Dividend / Profit / Reward Badge: Amethyst Purple Star
const DividendBadge = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="17" cy="17" r="17" fill="#8B5CF6" />
    {/* 4-point Sparkle Star */}
    <path
      d="M17 8 Q17 17 26 17 Q17 17 17 26 Q17 17 8 17 Q17 17 17 8 Z"
      fill="#FFFFFF"
    />
    <circle cx="23" cy="11" r="1.5" fill="#FFFFFF" opacity="0.8" />
  </svg>
);

// 7. Loading / Progress Badge: Rotating Ring
const LoadingBadge = () => (
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
    <Loader2 size={18} color="#FFFFFF" className="animate-spin" />
  </div>
);

// 8. Delete / Trash Badge: Rose Red Circle with Trash
const DeleteBadge = () => (
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
);

// 9. Copied / Clipboard Badge: Teal Circle with Copy Icon
const CopiedBadge = () => (
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
);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const { theme } = useTheme();

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (
      type: ToastType,
      title: string,
      message?: string,
      action?: ToastAction,
      duration = 4500
    ): string => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newToast: ToastItem = { id, type, title, message, action, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
      return id;
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, message?: string, action?: ToastAction, duration = 4500) =>
      showToast("success", title, message, action, duration),
    [showToast]
  );
  const warning = useCallback(
    (title: string, message?: string, action?: ToastAction, duration = 4500) =>
      showToast("warning", title, message, action, duration),
    [showToast]
  );
  const info = useCallback(
    (title: string, message?: string, action?: ToastAction, duration = 4500) =>
      showToast("info", title, message, action, duration),
    [showToast]
  );
  const error = useCallback(
    (title: string, message?: string, action?: ToastAction, duration = 4500) =>
      showToast("error", title, message, action, duration),
    [showToast]
  );
  const security = useCallback(
    (title: string, message?: string, action?: ToastAction, duration = 4500) =>
      showToast("security", title, message, action, duration),
    [showToast]
  );
  const dividend = useCallback(
    (title: string, message?: string, action?: ToastAction, duration = 4500) =>
      showToast("dividend", title, message, action, duration),
    [showToast]
  );
  const deleted = useCallback(
    (title: string, message?: string, action?: ToastAction, duration = 4500) =>
      showToast("delete", title, message, action, duration),
    [showToast]
  );
  const copied = useCallback(
    (title: string, message?: string, action?: ToastAction, duration = 4500) =>
      showToast("copied", title, message, action, duration),
    [showToast]
  );
  const loading = useCallback(
    (title: string, message?: string) =>
      showToast("loading", title, message, undefined, 0), // manual dismiss
    [showToast]
  );

  const isDark = theme === "dark";

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        removeToast,
        success,
        warning,
        info,
        error,
        security,
        dividend,
        deleted,
        copied,
        loading,
      }}
    >
      {children}

      {/* Floating Notification Stack Container (Fixed Bottom-Right) */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          pointerEvents: "none",
          maxWidth: "calc(100vw - 32px)",
        }}
        aria-live="polite"
        role="region"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            className="toast-animate-in"
            style={{
              pointerEvents: "auto",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "12px 18px",
              borderRadius: "28px",
              minWidth: "290px",
              maxWidth: "400px",
              backgroundColor: isDark ? "#12141A" : "#FFFFFF",
              border: isDark
                ? "1px solid rgba(255, 255, 255, 0.12)"
                : "1px solid rgba(0, 0, 0, 0.07)",
              boxShadow: isDark
                ? "0 14px 32px -4px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.06)"
                : "0 12px 28px -4px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.04)",
              transition: "transform 0.2s ease, opacity 0.2s ease",
            }}
          >
            {/* 1. Distinctive Icon Badge */}
            {item.type === "success" && <SuccessBadge />}
            {item.type === "warning" && <WarningBadge />}
            {item.type === "info" && <InfoBadge />}
            {item.type === "error" && <ErrorBadge />}
            {item.type === "security" && <SecurityBadge />}
            {item.type === "dividend" && <DividendBadge />}
            {item.type === "delete" && <DeleteBadge />}
            {item.type === "copied" && <CopiedBadge />}
            {item.type === "loading" && <LoadingBadge />}

            {/* 2. Text Content (Title & Subtitle) */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: isDark ? "#F8FAFC" : "#1F2937",
                  lineHeight: 1.3,
                  letterSpacing: "-0.01em",
                }}
              >
                {item.title}
              </div>
              {item.message && (
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 400,
                    color: isDark ? "#94A3B8" : "#64748B",
                    lineHeight: 1.4,
                    marginTop: "2px",
                  }}
                >
                  {item.message}
                </div>
              )}
            </div>

            {/* 3. Optional Inline Action Button */}
            {item.action && (
              <button
                type="button"
                onClick={() => {
                  item.action?.onClick();
                  removeToast(item.id);
                }}
                style={{
                  background: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(15, 91, 228, 0.08)",
                  color: isDark ? "#FFFFFF" : "var(--color-brand)",
                  border: isDark ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid rgba(15, 91, 228, 0.25)",
                  padding: "4px 10px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: "pointer",
                  flexShrink: 0,
                  transition: "background var(--transition-fast)",
                }}
              >
                {item.action.label}
              </button>
            )}

            {/* 4. Dismiss Cross (✕) */}
            <button
              type="button"
              onClick={() => removeToast(item.id)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isDark ? "#64748B" : "#9CA3AF",
                flexShrink: 0,
                transition: "color var(--transition-fast), transform var(--transition-fast)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = isDark ? "#F8FAFC" : "#1F2937";
                e.currentTarget.style.transform = "scale(1.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isDark ? "#64748B" : "#9CA3AF";
                e.currentTarget.style.transform = "scale(1)";
              }}
              aria-label="Close notification"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
