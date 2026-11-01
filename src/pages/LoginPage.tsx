import React, { useState } from "react";
import { User, Lock, Eye, EyeOff, ShieldCheck, Sparkles, Moon, Sun, Globe, X, Shield, FileText, Scale, FileCheck } from "lucide-react";
import { Logo } from "../components/common/Logo";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth, DEMO_USERS } from "../contexts/AuthContext";

export const LoginPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { login, isLoading } = useAuth();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successUser, setSuccessUser] = useState<string | null>(null);

  // Modals state
  const [activeModal, setActiveModal] = useState<"forgot" | "privacy" | "policy" | "terms" | "conditions" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!userId.trim()) {
      setError(language === "bn" ? "অনুগ্রহ করে আপনার ইউজার আইডি দিন" : "Please enter your User ID");
      return;
    }

    const res = await login(userId, password);
    if (res.success) {
      setSuccessUser(userId.trim().toLowerCase());
    } else {
      setError(t.auth.invalidCredentials);
    }
  };

  const handleQuickFill = (id: string) => {
    setUserId(id);
    setPassword("password123");
    setError("");
    login(id).then((res) => {
      if (res.success) {
        setSuccessUser(id);
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

            {/* Error Message */}
            {error && (
              <div
                style={{
                  padding: "8px 12px",
                  backgroundColor: "var(--color-error-soft)",
                  border: "1px solid rgba(239, 68, 68, 0.25)",
                  color: "var(--color-error)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "12px",
                  marginBottom: "12px",
                }}
              >
                {error}
              </div>
            )}

            {/* Logged in success preview */}
            {successUser && (
              <div
                style={{
                  padding: "10px 12px",
                  backgroundColor: "var(--color-success-soft)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  color: "var(--color-success)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "12px",
                  fontWeight: 600,
                  marginBottom: "12px",
                  textAlign: "center",
                }}
              >
                ✓ Authenticated as <span style={{ fontFamily: "monospace" }}>{successUser}</span>!
              </div>
            )}

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
      </div>
    </div>
  );
};

