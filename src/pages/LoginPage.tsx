import React, { useState } from "react";
import { User, Lock, Eye, EyeOff, ShieldCheck, Sparkles, Moon, Sun, Globe, X } from "lucide-react";
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
  const [activeModal, setActiveModal] = useState<"forgot" | "privacy" | "terms" | null>(null);

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
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text-primary)",
        position: "relative",
        transition: "background-color var(--transition-normal)",
      }}
    >
      {/* Top Right Floating Language & Theme Controls */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "24px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          zIndex: 10,
        }}
      >
        <button
          onClick={toggleLanguage}
          className="btn-secondary"
          style={{
            padding: "6px 12px",
            fontSize: "12px",
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            borderRadius: "var(--radius-full)",
          }}
          title="Switch Language (English / বাংলা)"
        >
          <Globe size={14} style={{ color: "var(--color-brand)" }} />
          <span>{language === "en" ? "বাংলা" : "EN"}</span>
        </button>

        <button
          onClick={toggleTheme}
          className="btn-secondary"
          style={{
            padding: "6px 12px",
            fontSize: "12px",
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            borderRadius: "var(--radius-full)",
          }}
          title={theme === "dark" ? "Switch to Soft White" : "Switch to Pitch Black"}
        >
          {theme === "dark" ? (
            <>
              <Sun size={14} style={{ color: "var(--color-brand-variant)" }} />
              <span>Light</span>
            </>
          ) : (
            <>
              <Moon size={14} style={{ color: "var(--color-brand)" }} />
              <span>Dark</span>
            </>
          )}
        </button>
      </div>

      {/* Center Auth Card */}
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 16px 48px",
        }}
      >
        <div
          className="fintech-card"
          style={{
            width: "100%",
            maxWidth: "420px",
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
            boxShadow: "var(--shadow-card)",
            padding: "36px 32px",
            position: "relative",
          }}
        >
          {/* Logo & Heading */}
          <div style={{ textAlign: "center", marginBottom: "26px" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "18px" }}>
              <Logo size="lg" showText={false} />
            </div>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: 600,
                color: "var(--color-text-primary)",
                marginBottom: "6px",
              }}
            >
              {t.auth.loginTitle}
            </h1>
            <p
              style={{
                fontSize: "13px",
                color: "var(--color-text-secondary)",
                lineHeight: 1.5,
              }}
            >
              {t.auth.loginSubtitle}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                padding: "10px 14px",
                backgroundColor: "var(--color-error-soft)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
                color: "var(--color-error)",
                borderRadius: "var(--radius-md)",
                fontSize: "12px",
                marginBottom: "18px",
              }}
            >
              {error}
            </div>
          )}

          {/* Logged in success preview */}
          {successUser && (
            <div
              style={{
                padding: "12px 14px",
                backgroundColor: "var(--color-success-soft)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                color: "var(--color-success)",
                borderRadius: "var(--radius-md)",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "18px",
                textAlign: "center",
              }}
            >
              ✓ Authenticated as <span style={{ fontFamily: "monospace" }}>{successUser}</span>!
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--color-text-secondary)",
                  marginBottom: "6px",
                }}
              >
                User ID
              </label>
              <div style={{ position: "relative" }}>
                <User
                  size={17}
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--color-text-muted)",
                  }}
                />
                <input
                  type="text"
                  placeholder={t.auth.userIdPlaceholder}
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  style={{
                    paddingLeft: "42px",
                    backgroundColor: "var(--color-surface-subtle)",
                    borderColor: "var(--color-border)",
                  }}
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label
                  style={{
                    fontSize: "12px",
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
                    fontSize: "12px",
                    padding: 0,
                    fontWeight: 500,
                  }}
                >
                  {t.auth.forgotPassword}
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <Lock
                  size={17}
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--color-text-muted)",
                  }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={t.auth.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    paddingLeft: "42px",
                    paddingRight: "42px",
                    backgroundColor: "var(--color-surface-subtle)",
                    borderColor: "var(--color-border)",
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
                    color: "var(--color-text-muted)",
                    padding: "4px",
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
                padding: "12px",
                marginTop: "6px",
                backgroundColor: "var(--color-brand)",
                borderRadius: "var(--radius-md)",
              }}
            >
              {isLoading ? t.auth.loggingIn : t.auth.loginBtn}
            </button>
          </form>

          {/* Quick Demo Logins Section */}
          <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid var(--color-border)" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "10px",
                fontSize: "11px",
                color: "var(--color-text-secondary)",
                fontWeight: 600,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
              }}
            >
              <Sparkles size={13} style={{ color: "var(--color-brand-variant)" }} />
              <span>{t.auth.quickDemo}</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {Object.keys(DEMO_USERS).map((key) => {
                const u = DEMO_USERS[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleQuickFill(key)}
                    className="btn-secondary"
                    style={{
                      padding: "8px 10px",
                      fontSize: "12px",
                      justifyContent: "flex-start",
                      gap: "8px",
                      backgroundColor: "var(--color-surface-subtle)",
                      borderColor: "var(--color-border)",
                    }}
                  >
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
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
                    <span style={{ color: "var(--color-text-muted)", fontSize: "10px", marginLeft: "auto" }}>
                      {u.role}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Security & Policy Links */}
          <div
            style={{
              marginTop: "24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
              fontSize: "12px",
            }}
          >
            <div style={{ display: "flex", gap: "14px", color: "var(--color-text-secondary)" }}>
              <button
                onClick={() => setActiveModal("privacy")}
                style={{ background: "transparent", color: "inherit", padding: 0 }}
              >
                {t.auth.privacyPolicy}
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveModal("terms")}
                style={{ background: "transparent", color: "inherit", padding: 0 }}
              >
                {t.auth.termsConditions}
              </button>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                color: "var(--color-text-muted)",
                fontSize: "11px",
              }}
            >
              <ShieldCheck size={13} style={{ color: "var(--color-success)" }} />
              <span>{t.auth.securedBy}</span>
            </div>
          </div>
        </div>
      </main>

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
                {activeModal === "terms" && t.modals.termsTitle}
              </h3>
              <button onClick={() => setActiveModal(null)} className="btn-ghost" style={{ padding: "4px" }}>
                <X size={18} />
              </button>
            </div>
            <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "20px" }}>
              {activeModal === "forgot" && t.modals.forgotPasswordBody}
              {activeModal === "privacy" && t.modals.privacyBody}
              {activeModal === "terms" && t.modals.termsBody}
            </p>
            <button className="btn-primary" style={{ width: "100%" }} onClick={() => setActiveModal(null)}>
              {t.modals.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

