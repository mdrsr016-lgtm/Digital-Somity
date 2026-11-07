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
import { APP_VERSION } from "./constants/appVersion";
import { applyLiveUpdate } from "./utils/liveUpdate";
import { startAndroidBackButtonListener } from "./utils/androidBackButton";
import { neutralizeNativeFontScale } from "./utils/nativeFontScale";

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

        {/* APK Version Pill */}
        <div
          style={{
            marginTop: "6px",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: "var(--color-brand-variant, #38BDF8)",
            padding: "3px 10px",
            borderRadius: "999px",
            backgroundColor: "rgba(15, 91, 228, 0.1)",
            border: "1px solid rgba(56, 189, 248, 0.25)",
            display: "inline-flex",
            alignItems: "center",
            boxShadow: "0 2px 10px rgba(15, 91, 228, 0.15)",
          }}
        >
          <span>v{APP_VERSION}</span>
        </div>
      </div>

      {/* Subtle Bottom Footer */}
      <div
        style={{
          position: "absolute",
          bottom: "calc(26px + env(safe-area-inset-bottom, 0px))",
          fontSize: "11.5px",
          fontWeight: 600,
          letterSpacing: "0.08em",
          color: "var(--color-text-muted, #64748B)",
          opacity: 0.75,
          textTransform: "uppercase",
        }}
      >
        Digital Somity • v{APP_VERSION}
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

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      document.documentElement.classList.add("is-native-app");
      document.body.classList.add("is-native-app");
      neutralizeNativeFontScale();
    }

    const run = () => {
      applyLiveUpdate().catch(() => {});
    };
    run();
    const onVisible = () => {
      if (document.visibilityState === "visible") run();
    };
    document.addEventListener("visibilitychange", onVisible);
    const stopBack = startAndroidBackButtonListener();
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      stopBack();
      document.documentElement.classList.remove("is-native-app");
      document.body.classList.remove("is-native-app");
    };
  }, []);

  return (
    <>
      <PullToRefresh />
      <UpdateNotificationModal />
      <div id="ptr-content">
        {showApkSplash && <ApkSplashScreen onFinish={() => setShowApkSplash(false)} />}
        {currentUser ? <DashboardPage /> : <LoginPage />}
      </div>
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
