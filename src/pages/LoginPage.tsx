import React, { useState } from "react";
import { User, Lock, Eye, EyeOff, ShieldCheck, Moon, Sun, Globe, X, Shield, FileText, Scale, FileCheck, Ticket, KeyRound, Check } from "lucide-react";
import { Logo } from "../components/common/Logo";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth, DEMO_USERS } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

export const LoginPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { login, isLoading } = useAuth();
  const { success, warning, info, error } = useToast();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successUser, setSuccessUser] = useState<string | null>(null);

  // Recently saved account state
  const [savedAccount, setSavedAccount] = useState<string>(() => {
    return localStorage.getItem("ds_recent_account") || "adm00";
  });

  // Modals state
  const [activeModal, setActiveModal] = useState<"forgot" | "privacy" | "policy" | "terms" | "conditions" | "register" | null>(null);
  const [inviteCode, setInviteCode] = useState("");
  const [isVerifyingInvite, setIsVerifyingInvite] = useState(false);

  const handleVerifyInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = inviteCode.trim().toUpperCase();

    if (!cleanCode) {
      warning(
        language === "bn" ? "সতর্কতা" : "Invitation Required",
        language === "bn" ? "অনুগ্রহ করে আপনার ব্রাঞ্চের আমন্ত্রণ কোড লিখুন।" : "Please enter your branch invitation code to proceed."
      );
      return;
    }

    setIsVerifyingInvite(true);
    setTimeout(() => {
      setIsVerifyingInvite(false);
      setActiveModal(null);
      setInviteCode("");
      success(
        language === "bn" ? "আমন্ত্রণ কোড গৃহীত হয়েছে!" : "Invitation Verified!",
        language === "bn"
          ? `কোড #${cleanCode} সফলভাবে যাচাই করা হয়েছে। ব্রাঞ্চ: সেন্ট্রাল হেডকোয়ার্টার্স।`
          : `Invitation code #${cleanCode} verified! Branch: Central Somiti (HQ).`
      );
    }, 600);
  };

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
      setSavedAccount(userStr);
      localStorage.setItem("ds_recent_account", userStr);
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
    setSavedAccount(id);
    localStorage.setItem("ds_recent_account", id);
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
          padding: "clamp(10px, 2.2vh, 16px) clamp(14px, 4vw, 20px)",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {/* Top: Recently Saved Accounts Row (Profile Circles Only) */}
        <header
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "2px",
            marginBottom: "4px",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "var(--color-text-secondary)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: "8px",
              opacity: 0.85,
            }}
          >
            {t.auth.recentlySavedAccount}
          </div>

          {/* Row of Profile Circles Only */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "clamp(12px, 3.5vw, 18px)",
            }}
          >
            {Object.keys(DEMO_USERS).map((k) => {
              const u = DEMO_USERS[k];
              const isSelected = k === savedAccount;
              const roleColor =
                u.role === "admin"
                  ? "var(--color-brand)"
                  : u.role === "cashier"
                  ? "var(--color-brand-variant)"
                  : u.role === "investor"
                  ? "var(--color-success)"
                  : "#8B5CF6";

              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => handleQuickFill(k)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                    transition: "transform 0.15s ease",
                  }}
                  title={`${k} • ${u.name} (${language === "bn" ? u.role_name_bn : u.role_name_en})`}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background: theme === "dark" ? "#000000" : "#FFFFFF",
                      border: `2px solid ${isSelected ? "var(--color-brand)" : roleColor}`,
                      boxShadow: isSelected
                        ? theme === "dark"
                          ? "0 0 14px rgba(15, 91, 228, 0.6), 0 0 0 2px rgba(15, 91, 228, 0.3)"
                          : "0 0 12px rgba(15, 91, 228, 0.35), 0 0 0 2px rgba(15, 91, 228, 0.2)"
                        : theme === "dark"
                        ? "0 2px 8px rgba(0, 0, 0, 0.6)"
                        : "0 2px 6px rgba(0, 0, 0, 0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <div
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "50%",
                        backgroundColor:
                          u.role === "admin"
                            ? "rgba(15, 91, 228, 0.15)"
                            : u.role === "cashier"
                            ? "rgba(2, 132, 199, 0.15)"
                            : u.role === "investor"
                            ? "rgba(22, 163, 74, 0.15)"
                            : "rgba(139, 92, 246, 0.15)",
                        color: roleColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "13px",
                      }}
                    >
                      {u.initial}
                    </div>

                    {/* Online Status Badge */}
                    <span
                      style={{
                        position: "absolute",
                        bottom: "-1px",
                        right: "-1px",
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "#16A34A",
                        border: `2px solid ${theme === "dark" ? "#000000" : "#FFFFFF"}`,
                      }}
                    />
                  </div>

                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: isSelected ? 700 : 500,
                      fontFamily: "monospace",
                      color: isSelected ? "var(--color-brand)" : "var(--color-text-secondary)",
                    }}
                  >
                    {k}
                  </span>
                </button>
              );
            })}
          </div>
        </header>

        {/* Center Auth Card (Mobile-First) */}
        <main
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4px 0",
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
              padding: "clamp(20px, 3vh, 24px) clamp(18px, 4vw, 22px)",
              position: "relative",
              borderRadius: "var(--radius-xl)",
              transition: "box-shadow var(--transition-normal), border-color var(--transition-normal)",
            }}
          >
            {/* Logo & Heading */}
            <div style={{ textAlign: "center", marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                <Logo size="md" showText={true} />
              </div>
              <h1
                style={{
                  fontSize: "19px",
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                  marginBottom: "4px",
                  letterSpacing: "-0.02em",
                }}
              >
                {t.auth.loginTitle}
              </h1>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.45,
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
                    textTransform: "uppercase",
                    letterSpacing: "0.03em",
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
                    style={{ paddingLeft: "40px", minHeight: "44px", fontSize: "14px" }}
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
                      textTransform: "uppercase",
                      letterSpacing: "0.03em",
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
                      fontSize: "14px",
                    }}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      color: "var(--color-input-icon)",
                      padding: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
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
                  marginTop: "2px",
                  backgroundColor: "var(--color-brand)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                {isLoading ? t.auth.loggingIn : t.auth.loginBtn}
              </button>

              {/* Don't have an account? Register link (Opens Invitation Code Modal) */}
              <div
                style={{
                  textAlign: "center",
                  marginTop: "8px",
                  fontSize: "12px",
                  color: "var(--color-text-secondary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "5px",
                }}
              >
                <span>{t.auth.dontHaveAccount}</span>
                <button
                  type="button"
                  onClick={() => {
                    setInviteCode("");
                    setActiveModal("register");
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "var(--color-brand)",
                    fontWeight: 600,
                    fontSize: "12px",
                    cursor: "pointer",
                    padding: 0,
                    textDecoration: "underline",
                    textUnderlineOffset: "2px",
                    transition: "color var(--transition-fast)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-brand-variant)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-brand)")}
                >
                  {t.auth.register}
                </button>
              </div>
            </form>

            {/* Footer Security Badge inside card */}
            <div
              style={{
                marginTop: "14px",
                paddingTop: "10px",
                borderTop: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
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
            gap: "clamp(4px, 1.3vw, 9px)",
            paddingTop: "6px",
            paddingBottom: "max(10px, env(safe-area-inset-bottom, 10px))",
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
              fontSize: "clamp(10px, 2.3vw, 11px)",
              fontWeight: 500,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "2px 0",
              flexShrink: 0,
              whiteSpace: "nowrap",
              transition: "color var(--transition-fast)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-brand)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
            title="Switch Language"
          >
            <Globe size={12} style={{ color: "var(--color-brand)", flexShrink: 0 }} />
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
              fontSize: "clamp(10px, 2.3vw, 11px)",
              fontWeight: 500,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
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
                <Sun size={12} style={{ color: "var(--color-brand-variant)", flexShrink: 0 }} />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon size={12} style={{ color: "var(--color-brand)", flexShrink: 0 }} />
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
              fontSize: "clamp(10px, 2.3vw, 11px)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "2px 0",
              flexShrink: 0,
              whiteSpace: "nowrap",
              transition: "color var(--transition-fast)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
            title={t.auth.privacy}
          >
            <Shield size={12} style={{ color: "var(--color-brand)", flexShrink: 0 }} />
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
              fontSize: "clamp(10px, 2.3vw, 11px)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "2px 0",
              flexShrink: 0,
              whiteSpace: "nowrap",
              transition: "color var(--transition-fast)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
            title={t.auth.policy}
          >
            <FileText size={12} style={{ color: "var(--color-brand-variant)", flexShrink: 0 }} />
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
              fontSize: "clamp(10px, 2.3vw, 11px)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "2px 0",
              flexShrink: 0,
              whiteSpace: "nowrap",
              transition: "color var(--transition-fast)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
            title={t.auth.terms}
          >
            <Scale size={12} style={{ color: "var(--color-brand)", flexShrink: 0 }} />
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
              fontSize: "clamp(10px, 2.3vw, 11px)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "2px 0",
              flexShrink: 0,
              whiteSpace: "nowrap",
              transition: "color var(--transition-fast)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
            title={t.auth.conditions}
          >
            <FileCheck size={12} style={{ color: "var(--color-brand-variant)", flexShrink: 0 }} />
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
            {activeModal === "register" ? (
              /* Dedicated Invitation Code Modal */
              <div
                className="fintech-card"
                style={{
                  maxWidth: "420px",
                  width: "100%",
                  backgroundColor: "var(--color-surface)",
                  boxShadow: "var(--shadow-modal)",
                  padding: "22px 20px",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                    paddingBottom: "10px",
                    borderBottom: "1px solid var(--color-border)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "var(--radius-full)",
                        backgroundColor: "rgba(15, 91, 228, 0.12)",
                        color: "var(--color-brand)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ticket size={16} />
                    </div>
                    <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--color-text-primary)" }}>
                      {t.auth.registerWithInvite}
                    </h3>
                  </div>
                  <button onClick={() => setActiveModal(null)} className="btn-ghost" style={{ padding: "4px" }}>
                    <X size={18} />
                  </button>
                </div>

                <p style={{ fontSize: "12px", color: "var(--color-text-secondary)", lineHeight: 1.5, marginBottom: "16px" }}>
                  {t.auth.inviteOnlyNotice}
                </p>

                <form onSubmit={handleVerifyInvite} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "var(--color-text-secondary)",
                        marginBottom: "6px",
                        textTransform: "uppercase",
                        letterSpacing: "0.03em",
                      }}
                    >
                      {t.auth.invitationCode}
                    </label>
                    <div style={{ position: "relative" }}>
                      <KeyRound
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
                        autoFocus
                        placeholder={language === "bn" ? "যেমন: SOMITI-2026" : "e.g. SOMITI-2026 or 849201"}
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                        style={{
                          paddingLeft: "40px",
                          minHeight: "44px",
                          fontSize: "14px",
                          fontFamily: "monospace",
                          letterSpacing: "0.08em",
                          fontWeight: 600,
                          textTransform: "uppercase",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: "10px", color: "var(--color-text-muted)", display: "block", marginTop: "5px" }}>
                      {language === "bn"
                        ? "পরীক্ষার জন্য যেকোনো কোড দিন (যেমন: SOMITI2026)"
                        : "For testing, enter any code (e.g. SOMITI2026)"}
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ flex: 1, minHeight: "42px" }}
                      onClick={() => setActiveModal(null)}
                    >
                      {t.modals.close}
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={isVerifyingInvite}
                      style={{
                        flex: 1.4,
                        minHeight: "42px",
                        backgroundColor: "var(--color-brand)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <Check size={15} />
                      <span>{isVerifyingInvite ? (language === "bn" ? "যাচাই হচ্ছে..." : "Verifying...") : t.auth.submitInviteCode}</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
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
            )}
          </div>
        )}

      </div>
    </div>
  );
};

