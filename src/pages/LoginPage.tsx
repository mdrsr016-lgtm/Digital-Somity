import React, { useState } from "react";
import { User, Lock, Eye, EyeOff, ShieldCheck, Moon, Sun, Globe, X, Ticket, KeyRound, Check } from "lucide-react";
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
  const [avatarErrors, setAvatarErrors] = useState<Record<string, boolean>>({});
  const [rememberMe, setRememberMe] = useState(true);

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
  };

  const renderUserCircle = (k: string) => {
    const u = DEMO_USERS[k];
    if (!u) return null;
    const isSelected = k === savedAccount;
    const roleColor = u.role_color || "var(--color-brand)";

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
          gap: "2px",
          transition: "transform 0.15s ease",
          flexShrink: 0,
        }}
        title={`${u.name} • ${language === "bn" ? u.role_name_bn : u.role_name_en} (${k})`}
      >
        <div
          style={{
            position: "relative",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: theme === "dark" ? "#000000" : "#FFFFFF",
            border: `2px solid ${isSelected ? roleColor : `${roleColor}80`}`,
            boxShadow: isSelected
              ? `0 0 12px ${roleColor}90, 0 0 0 2px ${roleColor}40`
              : "0 2px 5px rgba(0, 0, 0, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {!avatarErrors[k] && u.avatar_url ? (
            <img
              src={u.avatar_url}
              alt={u.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              onError={() => {
                setAvatarErrors((prev) => ({ ...prev, [k]: true }));
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: `${roleColor}25`,
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
          )}

          {/* Online Status Badge */}
          <span
            style={{
              position: "absolute",
              bottom: "1px",
              right: "1px",
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              backgroundColor: "#16A34A",
              border: `1.5px solid ${theme === "dark" ? "#000000" : "#FFFFFF"}`,
              zIndex: 2,
            }}
          />
        </div>

        <div style={{ textAlign: "center", lineHeight: 1.15 }}>
          <div
            style={{
              fontSize: "9.5px",
              fontWeight: 700,
              color: isSelected ? roleColor : "var(--color-text-primary)",
              letterSpacing: "0.01em",
            }}
          >
            {u.name}
          </div>
          <div
            style={{
              fontSize: "7.5px",
              fontWeight: 600,
              color: roleColor,
              letterSpacing: "0.02em",
            }}
          >
            {language === "bn" ? u.role_name_bn : u.role_name_en}
          </div>
        </div>
      </button>
    );
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
        {/* Top: Recently Saved Accounts Row (All 6 Roles: 2 System + 4 Clients) */}
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
              marginBottom: "6px",
              opacity: 0.85,
            }}
          >
            {t.auth.recentlySavedAccount}
          </div>

          {/* Row of All 6 Role Accounts: 2 System + 4 Clients */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "clamp(5px, 1.5vw, 9px)",
              background: theme === "dark" ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
              padding: "5px 8px",
              borderRadius: "16px",
              border: `1px solid ${theme === "dark" ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)"}`,
              maxWidth: "100%",
              boxSizing: "border-box",
            }}
          >
            {/* System Side: Aeysha (Founder) & Rafiq (Admin) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "clamp(3px, 1vw, 6px)",
              }}
            >
              <span
                style={{
                  fontSize: "8px",
                  fontWeight: 800,
                  color: "var(--color-text-secondary)",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  opacity: 0.6,
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  padding: "0 1px",
                }}
              >
                {t.auth.systemScope || "SYSTEM"}
              </span>

              {["aye01", "adm00"].map((k) => renderUserCircle(k))}
            </div>

            {/* Subtle Divider */}
            <div
              style={{
                width: "1px",
                height: "40px",
                backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
                margin: "0 1px",
              }}
            />

            {/* Clients Side: Nasrin (Manager), Karim (Cashier), Selim (Investor), Tania (Member) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "clamp(3px, 1vw, 6px)",
              }}
            >
              <span
                style={{
                  fontSize: "8px",
                  fontWeight: 800,
                  color: "var(--color-text-secondary)",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  opacity: 0.6,
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  padding: "0 1px",
                }}
              >
                {t.auth.clientScope || "CLIENTS"}
              </span>

              {["mng01", "csh01", "inv01", "mbr01"].map((k) => renderUserCircle(k))}
            </div>
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
              padding: "clamp(16px, 2.4vh, 22px) clamp(18px, 4vw, 22px)",
              position: "relative",
              borderRadius: "var(--radius-xl)",
              transition: "box-shadow var(--transition-normal), border-color var(--transition-normal)",
            }}
          >
            {/* Logo & Heading (Styled to Reference Mockup with SVG Logo on Top) */}
            <div style={{ textAlign: "center", marginBottom: "12px" }}>
              {/* Wallet SVG Logo Icon on Top */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "5px" }}>
                <svg
                  viewBox="0 0 5000 4008"
                  width={36}
                  height={36}
                  style={{
                    filter:
                      theme === "dark"
                        ? "drop-shadow(0 0 14px rgba(15, 91, 228, 0.65))"
                        : "drop-shadow(0 2px 8px rgba(15, 91, 228, 0.3))",
                    transition: "filter var(--transition-normal)",
                    flexShrink: 0,
                  }}
                >
                  <defs>
                    <linearGradient id="somiti-logo-gradient-login" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0F5BE4" />
                      <stop offset="100%" stopColor={theme === "dark" ? "#6BBCE9" : "#38BDF8"} />
                    </linearGradient>
                  </defs>
                  <path
                    fill="url(#somiti-logo-gradient-login)"
                    d="M3886 750.5h327.8c115.6 0 220.8 47.4 297.1 123.6l.3.3c76.2 76.3 123.6 181.5 123.6 297.1v723.8h224.9c40.7 0 73.8 33.1 73.8 73.8v1014.4c0 40.7-33.1 73.7-73.8 73.7h-224.9v467.1c0 115.7-47.4 220.9-123.6 297.2l-.3.2c-76.3 76.3-181.5 123.7-297.1 123.7H487c-115.7 0-220.9-47.4-297.1-123.7l-.3-.2C113.4 3745.2 66 3640 66 3524.3V477c0-113.8 45.9-217.5 120-293.5 72.4-74.1 171.9-121.9 282.1-126.8 3.4-.4 6.9-.7 10.4-.7H3465c115.6 0 220.9 47.4 297.1 123.6l.3.3C3838.6 256.2 3886 361.4 3886 477zM487 898l-8.8-.1-2.4-.1c-93.6-2.4-179.9-36-248.9-90.5l-.9-.8-2.1-1.6-1.8-1.5-6.1-5-2.1-1.8-.4-.3v2728c0 75.3 30.8 143.7 80.3 193.3 49.5 49.4 117.9 80.2 193.2 80.2h3726.8c75.2 0 143.7-30.8 193.2-80.2 49.5-49.6 80.3-118 80.3-193.3v-467.1h-645.1c-26.7 0-50-14.2-63-35.4l-177.8-249.3-179.9-252.2q-2.1-2.85-3.9-5.7l-1-1.7-1-1.9-.1-.2-1.4-2.7-1.7-4-.5-1.1-1.5-4.2-.1-.3-.4-1.4v-.1c-1.5-4.9-2.4-9.9-2.8-15l-.2-3.4-.1-2.4.1-2.3.2-3.5c.4-5 1.3-10 2.8-15l.4-1.5.1-.2 1.5-4.3.5-1.1 1.7-3.9 1.4-2.7.1-.3 1-1.9 1-1.6q1.8-3 3.9-5.7l179.9-252.2 177.8-249.3c13-21.2 36.3-35.4 63-35.4h645.1v-723.8c0-75.2-30.8-143.7-80.3-193.2S4289 898 4213.8 898zM282.1 657.9l.9.9.2.3 1.7 1.8 3.7 4.1.9.9 1.9 2 2.3 2.3.6.6 6.6 6.3 1.5 1.4 1.2 1.1.3.3c46.8 42.2 108.1 68.6 175.5 70.5h3259.1V477c0-75.3-30.8-143.7-80.3-193.3-49.5-49.4-117.9-80.2-193.2-80.2H478.5v-.1c-73 2.2-139.1 33.5-187.1 82.7-48.1 49.3-77.9 116.8-77.9 190.9 0 69.2 26 132.6 68.6 180.9M4561 2042.8h-681.1l-158.7 222.5-150.4 210.9 150.4 211 158.7 222.5h906v-866.9zm-1139.5 389.4c4.5-6 9.9-11.4 16.3-15.9zm662.8-183.4c62.8 0 119.7 25.5 160.9 66.6 41.1 41.2 66.6 98.1 66.6 160.9s-25.5 119.7-66.6 160.8c-41.2 41.2-98.1 66.7-160.9 66.7s-119.7-25.5-160.8-66.7q-2.4-2.4-4.6-4.9c-38.5-40.8-62.1-95.8-62.1-155.9 0-62.6 25.5-119.4 66.8-160.7l-.1-.2c41.1-41.1 98-66.6 160.8-66.6m56.6 170.9a79.97 79.97 0 0 0-56.6-23.4c-22.1 0-42.1 9-56.6 23.4l-.1-.2-.1.2c-14.4 14.3-23.2 34.3-23.2 56.6 0 20.9 7.8 39.8 20.6 53.9l2.8 2.7c14.5 14.4 34.5 23.4 56.6 23.4s42.2-9 56.6-23.4c14.4-14.5 23.4-34.5 23.4-56.6s-9-42.2-23.4-56.6"
                  />
                </svg>
              </div>

              {/* Brand Name */}
              <div
                style={{
                  fontSize: "clamp(21px, 3.2vw, 24px)",
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                  letterSpacing: language === "bn" ? "normal" : "-0.01em",
                  fontFamily: language === "bn" ? "var(--font-bangla)" : "var(--font-heading)",
                  lineHeight: 1.2,
                  marginBottom: "3px",
                }}
              >
                {language === "bn" ? "ডিজিটাল সমিতি" : "Digital Somiti"}
              </div>

              {/* Glowing Curved Blue Arc */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "2px 0 6px",
                }}
              >
                <svg width="46" height="7" viewBox="0 0 46 7" fill="none">
                  <path
                    d="M3 5.8C15 1.6 31 1.6 43 5.8"
                    stroke={theme === "dark" ? "#00A3FF" : "var(--color-brand)"}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    style={{
                      filter:
                        theme === "dark"
                          ? "drop-shadow(0 0 6px rgba(0, 163, 255, 0.75))"
                          : "drop-shadow(0 1px 3px rgba(15, 91, 228, 0.3))",
                    }}
                  />
                </svg>
              </div>

              {/* Main Heading: Sign In With Your ID */}
              <h1
                style={{
                  fontSize: "clamp(19px, 3vw, 21px)",
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                  marginBottom: "5px",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.25,
                }}
              >
                {language === "bn" ? (
                  <>
                    <span style={{ color: theme === "dark" ? "#00A3FF" : "var(--color-brand)" }}>আইডি</span> দিয়ে সাইন ইন করুন
                  </>
                ) : (
                  <>
                    Sign In With{" "}
                    <span style={{ color: theme === "dark" ? "#00A3FF" : "var(--color-brand)" }}>Your ID</span>
                  </>
                )}
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
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--color-text-secondary)",
                    marginBottom: "5px",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  <User size={13} style={{ color: "var(--color-brand)" }} />
                  <span>{language === "bn" ? "ইউজার আইডি" : "User ID"}</span>
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
                <label
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--color-text-secondary)",
                    marginBottom: "5px",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  <Lock size={13} style={{ color: "var(--color-brand)" }} />
                  <span>{language === "bn" ? "পাসওয়ার্ড" : "Password"}</span>
                </label>
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

              {/* Remember Me & Forgot Password Row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "-2px",
                  marginBottom: "2px",
                  userSelect: "none",
                }}
              >
                {/* Remember Me Checkbox */}
                <label
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{
                      accentColor: "var(--color-brand)",
                      width: "14px",
                      height: "14px",
                      cursor: "pointer",
                    }}
                  />
                  <span>{t.auth.rememberMe}</span>
                </label>

                {/* Forgot Password Link */}
                <button
                  type="button"
                  onClick={() => setActiveModal("forgot")}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--color-brand)",
                    fontSize: "12px",
                    fontWeight: 500,
                    cursor: "pointer",
                    padding: 0,
                    transition: "opacity var(--transition-fast)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  {t.auth.forgotPassword}
                </button>
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

        {/* Bottom Centered Controls: Responsive, No Cropping */}
        <footer
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "clamp(4px, 1.2vw, 8px)",
            rowGap: "4px",
            paddingTop: "6px",
            paddingBottom: "max(10px, env(safe-area-inset-bottom, 10px))",
            width: "100%",
            maxWidth: "100%",
            flexShrink: 0,
            userSelect: "none",
            boxSizing: "border-box",
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
              fontSize: "clamp(10px, 2.2vw, 11px)",
              fontWeight: 500,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "2px 4px",
              flexShrink: 0,
              whiteSpace: "nowrap",
              borderRadius: "4px",
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
              fontSize: "clamp(10px, 2.2vw, 11px)",
              fontWeight: 500,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "2px 4px",
              flexShrink: 0,
              whiteSpace: "nowrap",
              borderRadius: "4px",
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
              fontSize: "clamp(10px, 2.2vw, 11px)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              padding: "2px 4px",
              flexShrink: 0,
              whiteSpace: "nowrap",
              borderRadius: "4px",
              transition: "color var(--transition-fast)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
            title={t.auth.privacy}
          >
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
              fontSize: "clamp(10px, 2.2vw, 11px)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              padding: "2px 4px",
              flexShrink: 0,
              whiteSpace: "nowrap",
              borderRadius: "4px",
              transition: "color var(--transition-fast)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
            title={t.auth.policy}
          >
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
              fontSize: "clamp(10px, 2.2vw, 11px)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              padding: "2px 4px",
              flexShrink: 0,
              whiteSpace: "nowrap",
              borderRadius: "4px",
              transition: "color var(--transition-fast)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
            title={t.auth.terms}
          >
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
              fontSize: "clamp(10px, 2.2vw, 11px)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              padding: "2px 4px",
              flexShrink: 0,
              whiteSpace: "nowrap",
              borderRadius: "4px",
              transition: "color var(--transition-fast)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
            title={t.auth.conditions}
          >
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

