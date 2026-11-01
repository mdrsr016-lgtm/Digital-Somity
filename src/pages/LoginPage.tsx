import React, { useState } from "react";
import { User, Lock, Eye, EyeOff, ShieldCheck, Sparkles, Moon, Sun, Globe, X, Shield, FileText, Scale, FileCheck } from "lucide-react";
import { Logo } from "../components/common/Logo";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth, DEMO_USERS } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { NotificationShowcaseModal } from "../components/common/NotificationShowcaseModal";

export const LoginPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { login, isLoading } = useAuth();
  const { success, warning, info, error } = useToast();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successUser, setSuccessUser] = useState<string | null>(null);

  // Modals & Gallery state
  const [activeModal, setActiveModal] = useState<"forgot" | "privacy" | "policy" | "terms" | "conditions" | null>(null);
  const [showGallery, setShowGallery] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId.trim()) {
      warning(
        language === "bn" ? "সতর্কতা" : "Warning",
        language === "bn" ? "অনুগ্রহ করে আপনার ইউজার আইডি প্রদান করুন" : "Please enter your User ID to proceed"
      );
      return;
    }

    const res = await login(userId, password);
    if (res.success) {
      const userStr = userId.trim().toLowerCase();
      setSuccessUser(userStr);
      success(
        language === "bn" ? "সফল হয়েছে!" : "Success",
        language === "bn" ? `${userStr} হিসেবে সফলভাবে লগইন সম্পন্ন হয়েছে।` : `Authenticated successfully as ${userStr}!`
      );
    } else {
      error(
        language === "bn" ? "ত্রুটি!" : "Error",
        language === "bn" ? "ভুল ইউজার আইডি বা পাসওয়ার্ড। পুনরায় চেষ্টা করুন।" : "Invalid User ID or password. Please try again."
      );
    }
  };

  const handleQuickFill = (id: string) => {
    setUserId(id);
    setPassword("password123");
    login(id).then((res) => {
      if (res.success) {
        setSuccessUser(id);
        success(
          language === "bn" ? "সফল হয়েছে!" : "Success",
          language === "bn" ? `${id} হিসেবে ডেমো অ্যাকাউন্টে প্রবেশ করা হয়েছে।` : `Logged in successfully as #${id.toUpperCase()}`
        );
      }
    });
  };

  return (
    <div
      style={{
        height: "100dvh",
        maxHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text-primary)",
        position: "relative",
        overflow: "hidden",
        transition: "background-color var(--transition-normal)",
      }}
    >
      <div
        className="mobile-shell"
        style={{
          height: "100%",
          maxHeight: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "16px 16px 20px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {/* Center Auth Card (Mobile-First) */}
        <main
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px 0",
            minHeight: 0,
          }}
        >
          <div
            className="fintech-card"
            style={{
              width: "100%",
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
              boxShadow:
                theme === "dark"
                  ? "0 20px 50px -10px rgba(0, 0, 0, 0.95), 0 0 35px -5px rgba(15, 91, 228, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.12)"
                  : "0 16px 40px -12px rgba(4, 27, 69, 0.16), 0 0 0 1px #E5E0E4",
              padding: "24px 20px",
              position: "relative",
              borderRadius: "var(--radius-xl)",
              transition: "box-shadow var(--transition-normal), border-color var(--transition-normal)",
            }}
          >
            {/* Logo & Heading */}
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
                <Logo size="md" showText={true} />
              </div>
              <h1
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                  marginBottom: "4px",
                }}
              >
                {t.auth.loginTitle}
              </h1>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.4,
                }}
              >
                {t.auth.loginSubtitle}
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--color-text-secondary)",
                    marginBottom: "4px",
                  }}
                >
                  User ID
                </label>
                <div style={{ position: "relative" }}>
                  <User
                    size={16}
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--color-input-icon)",
                    }}
                  />
                  <input
                    type="text"
                    placeholder={t.auth.userIdPlaceholder}
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    style={{ paddingLeft: "40px", minHeight: "44px", fontSize: "15px" }}
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <label
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveModal("forgot")}
                    style={{
                      background: "transparent",
                      color: "var(--color-brand)",
                      fontSize: "11px",
                      padding: 0,
                      fontWeight: 500,
                    }}
                  >
                    {t.auth.forgotPassword}
                  </button>
                </div>
                <div style={{ position: "relative" }}>
                  <Lock
                    size={16}
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--color-input-icon)",
                    }}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={t.auth.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      paddingLeft: "40px",
                      paddingRight: "40px",
                      minHeight: "44px",
                      fontSize: "15px",
                    }}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      color: "var(--color-input-icon)",
                      padding: "4px",
                    }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Primary Sign In Button */}
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "11px",
                  minHeight: "44px",
                  marginTop: "4px",
                  backgroundColor: "var(--color-brand)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "14px",
                }}
              >
                {isLoading ? t.auth.loggingIn : t.auth.loginBtn}
              </button>
            </form>

            {/* Quick Demo Logins Section */}
            <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid var(--color-border)" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  marginBottom: "8px",
                  fontSize: "10px",
                  color: "var(--color-text-secondary)",
                  fontWeight: 600,
                  letterSpacing: "0.03em",
                  textTransform: "uppercase",
                }}
              >
                <Sparkles size={12} style={{ color: "var(--color-brand-variant)" }} />
                <span>{t.auth.quickDemo}</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                {Object.keys(DEMO_USERS).map((key) => {
                  const u = DEMO_USERS[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleQuickFill(key)}
                      className="btn-secondary"
                      style={{
                        padding: "6px 8px",
                        fontSize: "11px",
                        justifyContent: "flex-start",
                        gap: "6px",
                        backgroundColor: "var(--color-surface-subtle)",
                        borderColor: "var(--color-border)",
                      }}
                    >
                      <span
                        style={{
                          width: "7px",
                          height: "7px",
                          borderRadius: "var(--radius-full)",
                          backgroundColor:
                            u.role === "admin"
                              ? "var(--color-brand)"
                              : u.role === "cashier"
                              ? "var(--color-brand-variant)"
                              : u.role === "investor"
                              ? "var(--color-success)"
                              : "var(--color-text-secondary)",
                        }}
                      />
                      <span style={{ fontFamily: "monospace", fontWeight: 600 }}>{key}</span>
                      <span style={{ color: "var(--color-text-muted)", fontSize: "9px", marginLeft: "auto" }}>
                        {u.role}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Notification Card Previews (Explicit Success, Error, Warning, Info + Full 30-Card Gallery) */}
              <div
                style={{
                  marginTop: "10px",
                  paddingTop: "8px",
                  borderTop: "1px dashed var(--color-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "4px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowGallery(true)}
                  style={{
                    background: "rgba(15, 91, 228, 0.1)",
                    border: "1px solid rgba(15, 91, 228, 0.3)",
                    color: "var(--color-brand)",
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "2px 7px",
                    borderRadius: "var(--radius-full)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                  }}
                  title="Open All Possible Notification Cards Gallery (30 patterns)"
                >
                  <Sparkles size={10} />
                  <span>All Cards (30)</span>
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                  <button
                    type="button"
                    onClick={() => success("Success", "Your changes have been saved successfully.")}
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(22, 163, 74, 0.3)",
                      color: "#16A34A",
                      fontSize: "10px",
                      fontWeight: 600,
                      padding: "2px 5px",
                      borderRadius: "var(--radius-full)",
                      cursor: "pointer",
                    }}
                    title="Test Canonical Success Notification"
                  >
                    ✓ Success
                  </button>
                  <button
                    type="button"
                    onClick={() => error("Error", "An unexpected error occurred. Please try again.")}
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(220, 38, 38, 0.3)",
                      color: "#DC2626",
                      fontSize: "10px",
                      fontWeight: 600,
                      padding: "2px 5px",
                      borderRadius: "var(--radius-full)",
                      cursor: "pointer",
                    }}
                    title="Test Canonical Error Notification"
                  >
                    🛑 Error
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      warning("Warning", "Unsaved changes will be lost if you navigate away.", {
                        label: "Stay",
                        onClick: () => success("Saved", "Changes kept safe"),
                      })
                    }
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(245, 158, 11, 0.3)",
                      color: "#D97706",
                      fontSize: "10px",
                      fontWeight: 600,
                      padding: "2px 5px",
                      borderRadius: "var(--radius-full)",
                      cursor: "pointer",
                    }}
                    title="Test Canonical Warning Notification"
                  >
                    ⚠ Warning
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      info("Info", "Scheduled maintenance will occur tonight at 02:00 AM.", {
                        label: "Details",
                        onClick: () => alert("Maintenance window: 02:00 AM - 02:30 AM BST"),
                      })
                    }
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(37, 99, 235, 0.3)",
                      color: "#2563EB",
                      fontSize: "10px",
                      fontWeight: 600,
                      padding: "2px 5px",
                      borderRadius: "var(--radius-full)",
                      cursor: "pointer",
                    }}
                    title="Test Canonical Info Notification"
                  >
                    ℹ Info
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Security Badge inside card */}
            <div
              style={{
                marginTop: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                color: "var(--color-text-muted)",
                fontSize: "11px",
              }}
            >
              <ShieldCheck size={13} style={{ color: "var(--color-success)" }} />
              <span>{t.auth.securedBy}</span>
            </div>
          </div>
        </main>

        {/* Bottom Centered Controls: Strictly Single Line Across All Screens */}
        <footer
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "nowrap",
            whiteSpace: "nowrap",
            gap: "clamp(3px, 1.1vw, 8px)",
            paddingTop: "6px",
            paddingBottom: "env(safe-area-inset-bottom, 12px)",
            width: "100%",
            maxWidth: "100%",
            overflowX: "hidden",
            flexShrink: 0,
            userSelect: "none",
          }}
        >
          {/* Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--color-text-secondary)",
              fontSize: "clamp(9px, 2.3vw, 11px)",
              fontWeight: 500,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
              padding: "2px 0",
              flexShrink: 0,
              whiteSpace: "nowrap",
              transition: "color var(--transition-fast)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-brand)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
            title="Switch Language"
          >
            <Globe size={11} style={{ color: "var(--color-brand)", flexShrink: 0 }} />
            <span>{language === "en" ? "বাংলা" : "English"}</span>
          </button>

          <span style={{ color: "var(--color-border)", opacity: 0.4, fontSize: "8px", flexShrink: 0 }}>•</span>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--color-text-secondary)",
              fontSize: "clamp(9px, 2.3vw, 11px)",
              fontWeight: 500,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
              padding: "2px 0",
              flexShrink: 0,
              whiteSpace: "nowrap",
              transition: "color var(--transition-fast)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-brand)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
            title="Toggle Theme"
          >
            {theme === "dark" ? (
              <>
                <Sun size={11} style={{ color: "var(--color-brand-variant)", flexShrink: 0 }} />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon size={11} style={{ color: "var(--color-brand)", flexShrink: 0 }} />
                <span>Dark</span>
              </>
            )}
          </button>

          <span style={{ color: "var(--color-border)", opacity: 0.4, fontSize: "8px", flexShrink: 0 }}>•</span>

          {/* Privacy */}
          <button
            type="button"
            onClick={() => setActiveModal("privacy")}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--color-text-muted)",
              fontSize: "clamp(9px, 2.3vw, 11px)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
              padding: "2px 0",
              flexShrink: 0,
              whiteSpace: "nowrap",
              transition: "color var(--transition-fast)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
            title={t.auth.privacy}
          >
            <Shield size={11} style={{ color: "var(--color-brand)", flexShrink: 0 }} />
            <span>{t.auth.privacy}</span>
          </button>

          <span style={{ color: "var(--color-border)", opacity: 0.4, fontSize: "8px", flexShrink: 0 }}>•</span>

          {/* Policy */}
          <button
            type="button"
            onClick={() => setActiveModal("policy")}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--color-text-muted)",
              fontSize: "clamp(9px, 2.3vw, 11px)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
              padding: "2px 0",
              flexShrink: 0,
              whiteSpace: "nowrap",
              transition: "color var(--transition-fast)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
            title={t.auth.policy}
          >
            <FileText size={11} style={{ color: "var(--color-brand-variant)", flexShrink: 0 }} />
            <span>{t.auth.policy}</span>
          </button>

          <span style={{ color: "var(--color-border)", opacity: 0.4, fontSize: "8px", flexShrink: 0 }}>•</span>

          {/* Terms */}
          <button
            type="button"
            onClick={() => setActiveModal("terms")}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--color-text-muted)",
              fontSize: "clamp(9px, 2.3vw, 11px)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
              padding: "2px 0",
              flexShrink: 0,
              whiteSpace: "nowrap",
              transition: "color var(--transition-fast)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
            title={t.auth.terms}
          >
            <Scale size={11} style={{ color: "var(--color-brand)", flexShrink: 0 }} />
            <span>{t.auth.terms}</span>
          </button>

          <span style={{ color: "var(--color-border)", opacity: 0.4, fontSize: "8px", flexShrink: 0 }}>•</span>

          {/* Conditions */}
          <button
            type="button"
            onClick={() => setActiveModal("conditions")}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--color-text-muted)",
              fontSize: "clamp(9px, 2.3vw, 11px)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
              padding: "2px 0",
              flexShrink: 0,
              whiteSpace: "nowrap",
              transition: "color var(--transition-fast)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
            title={t.auth.conditions}
          >
            <FileCheck size={11} style={{ color: "var(--color-brand-variant)", flexShrink: 0 }} />
            <span>{t.auth.conditions}</span>
          </button>
        </footer>

        {/* Simple Popups / Modals */}
        {activeModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "var(--overlay-bg)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
            }}
            onClick={() => setActiveModal(null)}
          >
            <div
              className="fintech-card"
              style={{
                maxWidth: "460px",
                width: "100%",
                backgroundColor: "var(--color-surface)",
                boxShadow: "var(--shadow-modal)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "14px",
                  paddingBottom: "10px",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <h3 style={{ fontSize: "16px" }}>
                  {activeModal === "forgot" && t.modals.forgotPasswordTitle}
                  {activeModal === "privacy" && t.modals.privacyTitle}
                  {activeModal === "policy" && t.modals.policyTitle}
                  {activeModal === "terms" && t.modals.termsTitle}
                  {activeModal === "conditions" && t.modals.conditionsTitle}
                </h3>
                <button onClick={() => setActiveModal(null)} className="btn-ghost" style={{ padding: "4px" }}>
                  <X size={18} />
                </button>
              </div>
              <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "20px" }}>
                {activeModal === "forgot" && t.modals.forgotPasswordBody}
                {activeModal === "privacy" && t.modals.privacyBody}
                {activeModal === "policy" && t.modals.policyBody}
                {activeModal === "terms" && t.modals.termsBody}
                {activeModal === "conditions" && t.modals.conditionsBody}
              </p>
              <button className="btn-primary" style={{ width: "100%" }} onClick={() => setActiveModal(null)}>
                {t.modals.close}
              </button>
            </div>
          </div>
        )}

        {/* All Notification Cards Gallery Modal */}
        <NotificationShowcaseModal isOpen={showGallery} onClose={() => setShowGallery(false)} />
      </div>
    </div>
  );
};

