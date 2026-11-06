import React, { useState, useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { Logo } from "./components/common/Logo";
import { UpdateNotificationModal } from "./components/common/UpdateNotificationModal";
import { PullToRefresh } from "./components/common/PullToRefresh";

// ─── APK-Only Opening Splash Screen ──────────────────────────────────────────
const ApkSplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Hold splash for 1.2s then smoothly fade out
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(onFinish, 400);
    }, 1200);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "var(--color-bg, #080C16)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
        opacity: isFading ? 0 : 1,
        transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: isFading ? "none" : "auto",
        userSelect: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "18px",
          transform: isFading ? "scale(1.05)" : "scale(1)",
          transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Logo size="lg" layout="vertical" showText={true} />

        {/* Animated Loading Bar */}
        <div
          style={{
            marginTop: "10px",
            width: "110px",
            height: "3px",
            backgroundColor: "rgba(15, 91, 228, 0.15)",
            borderRadius: "999px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: "40%",
              backgroundColor: "#0F5BE4",
              borderRadius: "999px",
              animation: "apkSplashShimmer 1.1s infinite ease-in-out",
            }}
          />
        </div>
      </div>
      <style>{`
        @keyframes apkSplashShimmer {
          0% { left: -40%; width: 40%; }
          50% { width: 60%; }
          100% { left: 100%; width: 40%; }
        }
      `}</style>
    </div>
  );
};

// ─── Inner router (reads auth state) ─────────────────────────────────────────
const AppRouter: React.FC = () => {
  const { currentUser } = useAuth();
  const [showApkSplash, setShowApkSplash] = useState(() => Capacitor.isNativePlatform());

  return (
    <>
      <PullToRefresh />
      <UpdateNotificationModal />
      {showApkSplash && <ApkSplashScreen onFinish={() => setShowApkSplash(false)} />}
      {currentUser ? <DashboardPage /> : <LoginPage />}
    </>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <AppRouter />
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
