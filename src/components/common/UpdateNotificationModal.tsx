import React, { useState, useEffect, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Sparkles, ArrowUpCircle, Loader2, CheckCircle2, X } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  APP_VERSION,
  GITHUB_REPO_OWNER,
  GITHUB_REPO_NAME,
  APK_DOWNLOAD_URL,
  VERSION_CHECK_URL,
} from "../../constants/appVersion";

type UpdateState = "idle" | "checking" | "downloading" | "ready" | "dismissed";

/** Compare semver strings — returns true if remote > local */
function isNewer(remote: string, local: string): boolean {
  const parse = (v: string) => v.replace(/^v/, "").split(".").map(Number);
  const [rMaj, rMin, rPat] = parse(remote);
  const [lMaj, lMin, lPat] = parse(local);
  if (rMaj !== lMaj) return rMaj > lMaj;
  if (rMin !== lMin) return rMin > lMin;
  return rPat > lPat;
}

export const UpdateNotificationModal: React.FC = () => {
  const { language } = useLanguage();
  const [state, setState] = useState<UpdateState>("idle");
  const [remoteVersion, setRemoteVersion] = useState<string>("");
  const [commitMsg, setCommitMsg] = useState<string>("");
  const downloadTriggeredRef = useRef(false);

  useEffect(() => {
    // Only run on native Android APK
    if (!Capacitor.isNativePlatform()) return;

    let isMounted = true;
    setState("checking");

    const checkAndUpdate = async () => {
      try {
        // ── Step 1: Fetch version.json from GitHub ──────────────────────────
        const vRes = await fetch(`${VERSION_CHECK_URL}?t=${Date.now()}`, {
          headers: { "Cache-Control": "no-cache" },
        });
        if (!vRes.ok) { setState("idle"); return; }
        const vData = await vRes.json();
        const remoteVer: string = vData?.version || "";

        if (!remoteVer || !isNewer(remoteVer, APP_VERSION)) {
          // Already up to date
          if (isMounted) setState("idle");
          return;
        }

        if (!isMounted) return;
        setRemoteVersion(remoteVer);

        // ── Step 2: Fetch latest commit message ─────────────────────────────
        try {
          const cRes = await fetch(
            `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/commits/main`,
            { headers: { Accept: "application/vnd.github.v3+json" } }
          );
          if (cRes.ok) {
            const cData = await cRes.json();
            setCommitMsg(cData?.commit?.message?.split("\n")[0] || "");
          }
        } catch { /* non-critical */ }

        // ── Step 3: Show system notification ───────────────────────────────
        try {
          const perm = await LocalNotifications.checkPermissions();
          if (perm.display !== "granted") await LocalNotifications.requestPermissions();
          await LocalNotifications.schedule({
            notifications: [
              {
                id: 992,
                title: `⬇ Digital Somity v${remoteVer} Available`,
                body: "Downloading update now. Tap to install when ready.",
                schedule: { at: new Date(Date.now() + 600) },
                smallIcon: "ic_launcher_foreground",
              },
            ],
          });
        } catch { /* non-critical */ }

        // ── Step 4: Auto-trigger background download immediately ────────────
        // Android DownloadManager intercepts this via MainActivity setDownloadListener.
        // The BroadcastReceiver in MainActivity will auto-launch the system installer
        // when the download finishes — no button needed from JS.
        if (!downloadTriggeredRef.current) {
          downloadTriggeredRef.current = true;
          if (isMounted) setState("downloading");

          try {
            window.location.href = APK_DOWNLOAD_URL;
          } catch {
            const a = document.createElement("a");
            a.href = APK_DOWNLOAD_URL;
            a.click();
          }
        }
      } catch (err) {
        console.warn("[UpdateChecker] check failed:", err);
        if (isMounted) setState("idle");
      }
    };

    // Slight delay so app renders first
    const timer = setTimeout(checkAndUpdate, 2000);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const handleDismiss = () => setState("dismissed");

  // Don't render anything if idle, dismissed, or checking silently
  if (state === "idle" || state === "dismissed" || state === "checking") return null;

  const isDownloading = state === "downloading";
  const title = isDownloading
    ? (language === "bn" ? `v${remoteVersion} ডাউনলোড হচ্ছে...` : `Downloading v${remoteVersion}...`)
    : (language === "bn" ? `v${remoteVersion} ডাউনলোড সম্পন্ন` : `v${remoteVersion} Download Complete`);

  const subtitle = isDownloading
    ? (language === "bn"
        ? "আপডেট ডাউনলোড হচ্ছে। নোটিফিকেশন বারে অগ্রগতি দেখুন। ডাউনলোড শেষ হলে Android স্বয়ংক্রিয়ভাবে ইনস্টল করার অনুরোধ করবে।"
        : "Update downloading in the background. Watch the notification bar for progress. Android will prompt you to install when complete.")
    : (language === "bn"
        ? "ডাউনলোড শেষ। Android ইনস্টল ডায়ালগ খুলবে।"
        : "Download complete. Android install dialog should open.");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.72)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999999,
        padding: "20px",
        animation: "fadeInScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "340px",
          backgroundColor: "var(--color-surface, #0E131F)",
          border: "1px solid rgba(15, 91, 228, 0.3)",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(15, 91, 228, 0.2)",
          borderRadius: "22px",
          padding: "24px 20px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "14px",
          userSelect: "none",
          position: "relative",
        }}
      >
        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "rgba(255,255,255,0.06)",
            border: "none",
            borderRadius: "50%",
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--color-text-muted, #64748B)",
          }}
          title="Dismiss"
        >
          <X size={14} />
        </button>

        {/* Animated Icon */}
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "18px",
            background: "linear-gradient(135deg, rgba(15,91,228,0.25) 0%, rgba(56,189,248,0.18) 100%)",
            border: "1px solid rgba(56,189,248,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-brand-variant, #38BDF8)",
            boxShadow: "0 8px 24px rgba(15,91,228,0.3)",
            animation: isDownloading ? "pulse 2s infinite" : "none",
          }}
        >
          {isDownloading ? <Loader2 size={30} style={{ animation: "spin 1s linear infinite" }} /> : <CheckCircle2 size={30} />}
        </div>

        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "3px 10px",
            borderRadius: "999px",
            backgroundColor: "rgba(15,91,228,0.14)",
            color: "#38BDF8",
            fontSize: "11px",
            fontWeight: 600,
          }}
        >
          <Sparkles size={11} />
          <span>
            {language === "bn" ? "নতুন আপডেট" : "New Update"} &nbsp;
            <span style={{ opacity: 0.7, fontWeight: 400 }}>
              v{APP_VERSION} → v{remoteVersion}
            </span>
          </span>
        </div>

        {/* Title */}
        <div>
          <h3
            style={{
              margin: "0 0 6px",
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--color-text-primary, #FFFFFF)",
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </h3>

          {/* Commit message */}
          {commitMsg && (
            <p
              style={{
                margin: "0 0 4px",
                fontSize: "12px",
                color: "var(--color-text-secondary, #94A3B8)",
                backgroundColor: "rgba(255,255,255,0.03)",
                padding: "8px 12px",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.05)",
                wordBreak: "break-word",
                lineHeight: "1.4",
              }}
            >
              {commitMsg}
            </p>
          )}
        </div>

        {/* Subtitle */}
        <p
          style={{
            margin: 0,
            fontSize: "12px",
            lineHeight: "1.5",
            color: "var(--color-text-muted, #64748B)",
          }}
        >
          {subtitle}
        </p>

        {/* Downloading progress bar */}
        {isDownloading && (
          <div
            style={{
              width: "100%",
              height: "3px",
              backgroundColor: "rgba(15,91,228,0.15)",
              borderRadius: "999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "40%",
                backgroundColor: "#0F5BE4",
                borderRadius: "999px",
                animation: "shimmer 1.4s infinite ease-in-out",
              }}
            />
          </div>
        )}

        {/* Info row */}
        <p
          style={{
            margin: 0,
            fontSize: "11px",
            color: "rgba(255,255,255,0.25)",
          }}
        >
          {language === "bn"
            ? "Android স্বয়ংক্রিয়ভাবে ইনস্টল ডায়ালগ খুলবে"
            : "Android will auto-open the install dialog"}
        </p>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.93); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0%   { margin-left: -40%; }
          100% { margin-left: 100%; }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 8px 24px rgba(15,91,228,0.3); }
          50%       { box-shadow: 0 8px 36px rgba(15,91,228,0.6); }
        }
      `}</style>
    </div>
  );
};
