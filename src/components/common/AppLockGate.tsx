import React, { useCallback, useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";
import { Fingerprint, Lock, RefreshCw } from "lucide-react";
import { Logo } from "./Logo";
import {
  authenticateDeviceUnlock,
  isAppLockEnabled,
} from "../../utils/deviceUnlock";

/**
 * Blocks the native app behind a lock screen until the device
 * fingerprint / face / PIN unlock succeeds.
 */
export const AppLockGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isNative = Capacitor.isNativePlatform();
  const [unlocked, setUnlocked] = useState(() => !isNative || !isAppLockEnabled());
  const [busy, setBusy] = useState(false);
  const authInProgressRef = useRef(false);

  const tryUnlock = useCallback(async () => {
    if (!isNative) {
      setUnlocked(true);
      return;
    }
    if (!isAppLockEnabled()) {
      setUnlocked(true);
      return;
    }
    if (authInProgressRef.current) return;

    authInProgressRef.current = true;
    setBusy(true);
    try {
      const ok = await authenticateDeviceUnlock();
      if (ok) setUnlocked(true);
    } finally {
      setBusy(false);
      // Delay clearing so brief inactive flashes from the system prompt don't re-lock.
      setTimeout(() => {
        authInProgressRef.current = false;
      }, 400);
    }
  }, [isNative]);

  useEffect(() => {
    if (!isNative) return;

    if (isAppLockEnabled()) {
      setUnlocked(false);
      void tryUnlock();
    } else {
      setUnlocked(true);
    }

    let handle: { remove: () => Promise<void> } | undefined;
    CapApp.addListener("appStateChange", ({ isActive }) => {
      if (!isAppLockEnabled()) {
        setUnlocked(true);
        return;
      }
      if (!isActive) {
        if (!authInProgressRef.current) setUnlocked(false);
        return;
      }
      // Returning to foreground while locked → prompt again
      setUnlocked((prev) => {
        if (!prev) void tryUnlock();
        return prev;
      });
    }).then((h) => {
      handle = h;
    });

    return () => {
      handle?.remove().catch(() => {});
    };
  }, [isNative, tryUnlock]);

  if (!isNative || unlocked) return <>{children}</>;

  return (
    <>
      {children}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100000,
          background: "var(--color-bg, #000000)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "28px 24px",
          gap: 18,
          userSelect: "none",
        }}
      >
        <Logo size="lg" layout="vertical" showText={true} />
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: "rgba(15, 91, 228, 0.16)",
            border: "1px solid rgba(15, 91, 228, 0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-brand, #0F5BE4)",
            marginTop: 8,
          }}
        >
          {busy ? <RefreshCw size={28} style={{ animation: "spin 1s linear infinite" }} /> : <Lock size={28} />}
        </div>
        <div style={{ textAlign: "center", maxWidth: 280 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 800,
              color: "var(--color-text-primary, #fff)",
              fontFamily: "var(--font-heading)",
            }}
          >
            App Locked
          </h2>
          <p style={{ margin: "8px 0 0", fontSize: 13, color: "var(--color-text-muted, #94A3B8)", lineHeight: 1.45 }}>
            Unlock with fingerprint, face, or your device PIN / password to continue.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void tryUnlock()}
          disabled={busy}
          style={{
            marginTop: 8,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 20px",
            borderRadius: 12,
            border: "none",
            background: "var(--color-brand, #0F5BE4)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
            cursor: busy ? "wait" : "pointer",
            opacity: busy ? 0.7 : 1,
          }}
        >
          <Fingerprint size={18} />
          {busy ? "Waiting…" : "Unlock"}
        </button>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </>
  );
};
