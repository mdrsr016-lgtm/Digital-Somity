import React, { useCallback, useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";
import { Fingerprint, Lock, RefreshCw } from "lucide-react";
import { Logo } from "./Logo";
import {
  authenticateDeviceUnlock,
  clearSessionUnlocked,
  isAppLockEnabled,
  isSessionUnlocked,
  markAppBackgrounded,
  markSessionUnlocked,
  requestStartupPermissions,
  shouldRelockAfterBackground,
} from "../../utils/deviceUnlock";

/**
 * Blocks the native app behind a lock screen until the device
 * fingerprint / face / PIN unlock succeeds.
 *
 * Unlock is remembered for the WebView session so live-update / page
 * reloads do not ask again. Leaving the app for ~45s re-locks.
 */
export const AppLockGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isNative = Capacitor.isNativePlatform();
  const [unlocked, setUnlocked] = useState(() => {
    if (!isNative) return true;
    if (!isAppLockEnabled()) return true;
    return isSessionUnlocked();
  });
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [ready, setReady] = useState(!isNative);
  const authInProgressRef = useRef(false);
  const ignoreResumeUntilRef = useRef(0);
  const attemptRef = useRef(0);

  const tryUnlock = useCallback(
    async (source: "auto" | "tap" | "resume" = "auto") => {
      if (!isNative) {
        setUnlocked(true);
        return;
      }
      if (!isAppLockEnabled()) {
        setUnlocked(true);
        return;
      }
      // Already unlocked this session (e.g. after a reload) — stay open.
      if (source !== "tap" && isSessionUnlocked()) {
        setUnlocked(true);
        return;
      }
      if (source === "resume" && Date.now() < ignoreResumeUntilRef.current) return;

      if (source === "tap") {
        authInProgressRef.current = false;
      } else if (authInProgressRef.current) {
        return;
      }

      const attemptId = ++attemptRef.current;
      authInProgressRef.current = true;
      setBusy(true);
      setHint(null);

      try {
        if (source === "auto") {
          await new Promise((r) => setTimeout(r, 400));
        }

        const preferPin = source === "tap" && attemptId >= 3;
        const result = await authenticateDeviceUnlock({
          preferDeviceCredential: preferPin,
        });

        if (attemptId !== attemptRef.current) return;

        if (result.ok) {
          markSessionUnlocked();
          setUnlocked(true);
          setHint(null);
          return;
        }

        if (result.code === "userCancel" || result.code === "systemCancel") {
          setHint("Unlock cancelled. Tap Unlock to try again.");
        } else if (result.code === "notAvailable") {
          setHint("No fingerprint/PIN set on this device. Tap Unlock to try again.");
        } else if (result.code === "timeout") {
          setHint("Unlock timed out. Tap Unlock to try again.");
        } else if (result.message) {
          setHint(`${result.message}. Tap Unlock to retry.`);
        } else {
          setHint("Could not unlock. Tap Unlock to try again.");
        }
      } catch (err) {
        console.warn("Unlock attempt failed:", err);
        if (attemptId === attemptRef.current) {
          setHint("Could not open unlock prompt. Tap Unlock to retry.");
        }
      } finally {
        if (attemptId === attemptRef.current) {
          setBusy(false);
          ignoreResumeUntilRef.current = Date.now() + 1000;
          authInProgressRef.current = false;
        }
      }
    },
    [isNative]
  );

  useEffect(() => {
    if (!isNative) return;
    let cancelled = false;

    (async () => {
      await requestStartupPermissions();
      if (cancelled) return;
      setReady(true);

      if (!isAppLockEnabled()) {
        setUnlocked(true);
        return;
      }

      // Reload / live update: keep access if already unlocked this session.
      if (isSessionUnlocked()) {
        setUnlocked(true);
        return;
      }

      setUnlocked(false);
      await new Promise((r) => setTimeout(r, 1800));
      if (cancelled) return;
      void tryUnlock("auto");
    })();

    let handle: { remove: () => Promise<void> } | undefined;
    CapApp.addListener("appStateChange", ({ isActive }) => {
      if (!isAppLockEnabled()) {
        setUnlocked(true);
        return;
      }

      if (!isActive) {
        // Don't wipe unlock on brief pauses (prompt, permission sheet, reload).
        if (!authInProgressRef.current) {
          markAppBackgrounded();
        }
        return;
      }

      // Coming back to foreground
      if (authInProgressRef.current) return;
      if (Date.now() < ignoreResumeUntilRef.current) return;

      if (shouldRelockAfterBackground()) {
        clearSessionUnlocked();
        setUnlocked(false);
        void tryUnlock("resume");
        return;
      }

      // Short background or reload bounce — stay unlocked if session says so.
      if (isSessionUnlocked()) {
        setUnlocked(true);
      }
    }).then((h) => {
      handle = h;
    });

    return () => {
      cancelled = true;
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
          {busy || !ready ? (
            <RefreshCw size={28} style={{ animation: "spin 1s linear infinite" }} />
          ) : (
            <Lock size={28} />
          )}
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
          {hint ? (
            <p style={{ margin: "10px 0 0", fontSize: 12, color: "#F59E0B", lineHeight: 1.4 }}>{hint}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => void tryUnlock("tap")}
          disabled={busy || !ready}
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
            cursor: busy || !ready ? "wait" : "pointer",
            opacity: busy || !ready ? 0.7 : 1,
          }}
        >
          <Fingerprint size={18} />
          {busy || !ready ? "Waiting…" : "Unlock"}
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
