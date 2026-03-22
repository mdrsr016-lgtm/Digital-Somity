import { User, Lock, Eye, EyeOff, ShieldCheck, CheckCircle, Unlock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ForgotPasswordModal } from "./ForgotPasswordModal";
import { PrivacyModal } from "./PrivacyModal";
import { TermsModal } from "./TermsModal";
import { useLanguage } from "../contexts/LanguageContext";
import { mockUsers } from "../data/mockUsers";
import "../styles/LoginCard.css";

const MATRIX_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!";

// Load ALL users from localStorage and merge with mockUsers
function getAllUsers() {
  let localUsers: any[] = [];
  try {
    const saved = localStorage.getItem("ds_users");
    if (saved) {
      localUsers = JSON.parse(saved);
    }
  } catch (_) {
    // Ignore parse errors
  }

  // Merge: mockUsers take precedence or are just added alongside local ones
  // We'll use a Map to ensure unique IDs
  const usersMap = new Map();
  
  // Add mock users first
  mockUsers.forEach(u => usersMap.set(u.id.toLowerCase(), u));
  
  // Add local users (they will overwrite mock users if IDs clash, which is fine)
  localUsers.forEach(u => usersMap.set(u.id.toLowerCase(), u));

  return Array.from(usersMap.values());
}

type VerifyState = 'idle' | 'verifying' | 'verified' | 'not-found';

export const LoginCard = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const { t, language } = useLanguage();

  // User ID verification state
  const [userId, setUserId] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [verifyState, setVerifyState] = useState<VerifyState>('idle');
  const matrixIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resolveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const stopMatrix = useCallback(() => {
    if (matrixIntervalRef.current) clearInterval(matrixIntervalRef.current);
    if (resolveTimeoutRef.current) clearTimeout(resolveTimeoutRef.current);
  }, []);

  const startMatrixAnimation = useCallback((targetName: string, found: boolean) => {
    setVerifyState('verifying');
    stopMatrix();

    let tick = 0;
    const totalTicks = 22;
    const len = Math.max(userId.length, targetName.length, 8);

    matrixIntervalRef.current = setInterval(() => {
      tick++;
      // Generate scrambled text
      const scrambled = Array.from({ length: len }, (_, i) => {
        const progress = tick / totalTicks;
        const threshold = i / len;
        if (found && progress > threshold + 0.1) {
          return targetName[i] || ' ';
        }
        return MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
      }).join('');
      setDisplayText(scrambled);

      if (tick >= totalTicks) {
        clearInterval(matrixIntervalRef.current!);
        if (found) {
          setDisplayText(targetName);
          setVerifyState('verified');
        } else {
          setDisplayText(userId);
          setVerifyState('not-found');
        }
      }
    }, 60);
  }, [userId, stopMatrix]);

  const handleUserIdBlur = useCallback(() => {
    if (!userId.trim() || verifyState === 'verified') return;

    const users = getAllUsers();
    const match = users.find(
      (u: any) => u.id === userId.trim() || u.id.toLowerCase() === userId.trim().toLowerCase()
    );

    if (match) {
      startMatrixAnimation(match.name, true);
    } else {
      startMatrixAnimation(userId, false);
    }
  }, [userId, verifyState, startMatrixAnimation]);

  const handleUnlock = () => {
    stopMatrix();
    setVerifyState('idle');
    setDisplayText("");
    setUserId("");
  };

  // Keyboard support
  const handleUserIdKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      if (!isLocked && !isVerifying && userId.trim()) {
        e.preventDefault();
        handleUserIdBlur();
      }
    }
    if (e.key === 'Escape') {
      handleUnlock();
    }
  };

  const isLocked = verifyState === 'verified';
  const isVerifying = verifyState === 'verifying';
  const isNotFound = verifyState === 'not-found';

  useEffect(() => {
    if (isLocked) {
      passwordRef.current?.focus();
    }
  }, [isLocked]);

  useEffect(() => () => stopMatrix(), [stopMatrix]);

  const togglePassword = () => setShowPassword(!showPassword);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isVerifying) return;
    if (!isLocked) {
      handleUserIdBlur();
      return;
    }
    const users = getAllUsers();
    // Normalize lookup to be case-insensitive
    const user = users.find((u: any) => 
      u.id.toLowerCase() === userId.trim().toLowerCase()
    );

    if (!user) {
      setVerifyState('not-found');
      return;
    }

    const password = passwordRef.current?.value || "";
    if (user.password && user.password !== password) {
      // Access denied
      setVerifyState('not-found'); 
      return;
    }

    // Persistent Session Mock - Use the canonical ID from the match
    localStorage.setItem("ds_logged_in_user", user.id);
    
    if (user.roleEn === 'System Administrator') {
      navigate("/admin");
    } else {
      navigate("/workspace");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="login-card"
    >
      <form onSubmit={handleLogin}>
        {/* Logo Header */}
        <div className="logo-container">
          <svg className="header-logo" viewBox="0 0 5000 4008" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3886 750.5h327.8c115.6 0 220.8 47.4 297.1 123.6l.3.3c76.2 76.3 123.6 181.5 123.6 297.1v723.8h224.9c40.7 0 73.8 33.1 73.8 73.8v1014.4c0 40.7-33.1 73.7-73.8 73.7h-224.9v467.1c0 115.7-47.4 220.9-123.6 297.2l-.3.2c-76.3 76.3-181.5 123.7-297.1 123.7H487c-115.7 0-220.9-47.4-297.1-123.7l-.3-.2C113.4 3745.2 66 3640 66 3524.3V477c0-113.8 45.9-217.5 120-293.5 72.4-74.1 171.9-121.9 282.1-126.8 3.4-.4 6.9-.7 10.4-.7H3465c115.6 0 220.9 47.4 297.1 123.6l.3.3C3838.6 256.2 3886 361.4 3886 477zM487 898l-8.8-.1-2.4-.1c-93.6-2.4-179.9-36-248.9-90.5l-.9-.8-2.1-1.6-1.8-1.5-6.1-5-2.1-1.8-.4-.3v2728c0 75.3 30.8 143.7 80.3 193.3 49.5 49.4 117.9 80.2 193.2 80.2h3726.8c75.2 0 143.7-30.8 193.2-80.2 49.5-49.6 80.3-118 80.3-193.3v-467.1h-645.1c-26.7 0-50-14.2-63-35.4l-177.8-249.3-179.9-252.2q-2.1-2.85-3.9-5.7l-1-1.7-1-1.9-.1-.2-1.4-2.7-1.7-4-.5-1.1-1.5-4.2-.1-.3-.4-1.4v-.1c-1.5-4.9-2.4-9.9-2.8-15l-.2-3.4-.1-2.4.1-2.3.2-3.5c.4-5 1.3-10 2.8-15l.4-1.5.1-.2 1.5-4.3.5-1.1 1.7-3.9 1.4-2.7.1-.3 1-1.9 1-1.6q1.8-3 3.9-5.7l179.9-252.2 177.8-249.3c13-21.2 36.3-35.4 63-35.4h645.1v-723.8c0-75.2-30.8-143.7-80.3-193.2S4289 898 4213.8 898zM282.1 657.9l.9.9.2.3 1.7 1.8 3.7 4.1.9.9 1.9 2 2.3 2.3.6.6 6.6 6.3 1.5 1.4 1.2 1.1.3.3c46.8 42.2 108.1 68.6 175.5 70.5h3259.1V477c0-75.3-30.8-143.7-80.3-193.3-49.5-49.4-117.9-80.2-193.2-80.2H478.5v-.1c-73 2.2-139.1 33.5-187.1 82.7-48.1 49.3-77.9 116.8-77.9 190.9 0 69.2 26 132.6 68.6 180.9M4561 2042.8h-681.1l-158.7 222.5-150.4 210.9 150.4 211 158.7 222.5h906v-866.9zm-1139.5 389.4c4.5-6 9.9-11.4 16.3-15.9zm662.8-183.4c62.8 0 119.7 25.5 160.9 66.6 41.1 41.2 66.6 98.1 66.6 160.9s-25.5 119.7-66.6 160.8c-41.2 41.2-98.1 66.7-160.9 66.7s-119.7-25.5-160.8-66.7q-2.4-2.4-4.6-4.9c-38.5-40.8-62.1-95.8-62.1-155.9 0-62.6 25.5-119.4 66.8-160.7l-.1-.2c41.1-41.1 98-66.6 160.8-66.6m56.6 170.9a79.97 79.97 0 0 0-56.6-23.4c-22.1 0-42.1 9-56.6 23.4l-.1-.2-.1.2c-14.4 14.3-23.2 34.3-23.2 56.6 0 20.9 7.8 39.8 20.6 53.9l2.8 2.7c14.5 14.4 34.5 23.4 56.6 23.4s42.2-9 56.6-23.4c14.4-14.5 23.4-34.5 23.4-56.6s-9-42.2-23.4-56.6" fill="currentColor" />
          </svg>
          <span className="logo-text">{t.login.logoText}</span>
        </div>


      <h1 className={`title ${language === 'bn' ? 'title-bn' : ''}`}>{t.login.title}</h1>
      <p className="subtitle">
        {t.login.subtitle}
      </p>

      {/* Form Fields */}
      <div className="input-container">
        {/* User ID Field with Matrix Verification */}
        <div className={`relative-input userid-field ${isVerifying ? 'verifying' : ''} ${isLocked ? 'locked' : ''} ${isNotFound ? 'not-found' : ''}`}>
          {/* Left icon — static position wrapper so Framer Motion doesn't override translateY */}
          <div style={{
            position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
            display: 'flex', alignItems: 'center', zIndex: 2, pointerEvents: 'none'
          }}>
            <AnimatePresence mode="wait">
              {isLocked ? (
                <motion.span key="check" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} style={{ display: 'flex', color: '#10b981' }}>
                  <CheckCircle size={20} />
                </motion.span>
              ) : (
                <motion.span key="user" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', color: '#94a3b8' }}>
                  <User size={20} />
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <input
            type="text"
            placeholder={isVerifying ? '' : t.login.userIdPlaceholder}
            className={`form-input userid-input ${isVerifying ? 'matrix-animating' : ''} ${isLocked ? 'input-locked' : ''}`}
            value={isVerifying || isLocked ? displayText : userId}
            onChange={(e) => {
              if (!isLocked && !isVerifying) {
                setUserId(e.target.value);
                setVerifyState('idle');
                setDisplayText('');
              }
            }}
            onKeyDown={handleUserIdKeyDown}
            onBlur={handleUserIdBlur}
            readOnly={isLocked || isVerifying}
            aria-label="User ID"
          />

          {/* Right icon — static position wrapper so scale animation doesn't override translateY */}
          <div style={{
            position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
            display: 'flex', alignItems: 'center', zIndex: 3
          }}>
            <AnimatePresence>
              {isLocked && (
                <motion.button
                  key="unlock-btn"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  type="button"
                  onClick={handleUnlock}
                  title="Click to change User ID"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', color: 'var(--text-sub)',
                    padding: 4, lineHeight: 0
                  }}
                >
                  <Unlock size={18} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Matrix scanline overlay */}
          {isVerifying && (
            <div className="matrix-scanline" />
          )}
        </div>

        <div className="relative-input">
          <Lock className="input-icon" />
          <input
            ref={passwordRef}
            type={showPassword ? "text" : "password"}
            placeholder={t.login.passwordPlaceholder}
            className="form-input"
            style={{ paddingRight: '48px' }}
          />
          <button
            type="button"
            onClick={togglePassword}
            className="icon-button input-eye"
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
      </div>

      <div className="forgot-link">
        <button type="button" onClick={openModal} className="link-button">
          {t.login.forgotPassword}
        </button>
      </div>

      <ForgotPasswordModal isOpen={isModalOpen} onClose={closeModal} />

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="primary-button"
          type="submit"
        >
          {t.login.getStarted}
        </motion.button>
      </form>

      {/* Footer */}
      <div className="card-footer">
        <div className="footer-links">
          <a href="#" onClick={(e) => { e.preventDefault(); setIsPrivacyOpen(true); }}>{t.login.privacyPolicy}</a>
          <span className="dot">•</span>
          <a href="#" onClick={(e) => { e.preventDefault(); setIsTermsOpen(true); }}>{t.login.termsConditions}</a>
        </div>
        <div className="security-tag">
          <ShieldCheck size={14} className="security-icon" />
          <span>{t.login.securedBy} <span className="brand-highlight">Digital Somiti</span></span>
        </div>
      </div>

      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </motion.div>
  );
};
