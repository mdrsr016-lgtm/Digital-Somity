import React, { useState, useEffect, useRef } from "react";
import { Capacitor, registerPlugin } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Sparkles, Download, CheckCircle2, Loader2, RefreshCw, X, ArrowUpCircle } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  APP_VERSION,
  CURRENT_BUILD_SHA,
  GITHUB_REPO_OWNER,
  GITHUB_REPO_NAME,
  APK_DOWNLOAD_URL,
  VERSION_CHECK_URL,
} from "../../constants/appVersion";

// ── Native AppUpdater Plugin Interface ──────────────────────────────────────
interface AppUpdaterPlugin {
  isUpdateReady(): Promise<{ ready: boolean; size: number }>;
  downloadUpdate(options: { url: string }): Promise<{ success: boolean; bytesDownloaded: number }>;
  installUpdate(): Promise<{ success: boolean; needPermission?: boolean }>;
}

const AppUpdater = registerPlugin<AppUpdaterPlugin>("AppUpdater");

type ModalState = "hidden" | "downloading" | "ready_to_install" | "web_reload_ready" | "installing";

export const UpdateNotificationModal: React.FC = () => {
  const { language } = useLanguage();
  const [modalState, setModalState] = useState<ModalState>("hidden");
  const [targetVersion, setTargetVersion] = useState<string>("");
  const [commitSummary, setCommitSummary] = useState<string>("");
  const downloadStartedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const checkUpdates = async () => {
      try {
        // 1. Fetch remote version info
        let remoteVer = "";
        let remoteSha = "";

        try {
          const vRes = await fetch(`${VERSION_CHECK_URL}?_nocache=${Date.now()}`, {
            headers: { "Cache-Control": "no-cache" },
          });
          if (vRes.ok) {
            const vData = await vRes.json();
            remoteVer = vData?.version || "";
            remoteSha = vData?.sha || "";
          }
        } catch {
          // Fallback if version.json cannot be reached
        }

        // 2. Also query latest commit message for changelog display
        try {
          const cRes = await fetch(
            `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/commits/main`,
            { headers: { Accept: "application/vnd.github.v3+json" } }
          );
          if (cRes.ok) {
            const cData = await cRes.json();
            if (!remoteSha) remoteSha = cData?.sha || "";
            const msg = cData?.commit?.message?.split("\n")[0] || "";
            if (isMounted) setCommitSummary(msg);
          }
        } catch {}

        if (!remoteVer) {
          remoteVer = APP_VERSION;
        }

        // 3. Determine if an update exists
        const isVersionDifferent = remoteVer !== APP_VERSION;
        const isShaDifferent = Boolean(remoteSha && remoteSha !== CURRENT_BUILD_SHA);

        if (!isVersionDifferent && !isShaDifferent) {
          // No update available
          return;
        }

        const displayVer = isVersionDifferent ? remoteVer : `v${APP_VERSION}+`;
        if (isMounted) setTargetVersion(displayVer);

        // ── 4A. WEB VERSION: Show reload option ──────────────────────────────
        if (!Capacitor.isNativePlatform()) {
          if (isMounted) setModalState("web_reload_ready");
          return;
        }

        // ── 4B. ANDROID APK VERSION: Auto-download & prompt to install ────────
        // Check if previously downloaded APK is already on disk
        try {
          const status = await AppUpdater.isUpdateReady();
          if (status?.ready) {
            if (isMounted) setModalState("ready_to_install");
            return;
          }
        } catch {}

        // Auto-download in background (do NOT ask user to download)
        if (!downloadStartedRef.current) {
          downloadStartedRef.current = true;
          if (isMounted) setModalState("downloading");

          // Status bar notification that download is underway
          try {
            const perm = await LocalNotifications.checkPermissions();
            if (perm.display !== "granted") await LocalNotifications.requestPermissions();
            await LocalNotifications.schedule({
              notifications: [
                {
                  id: 991,
                  title: `⚡ Digital Somity ${displayVer}`,
                  body: language === "bn" ? "নতুন আপডেট ডাউনলোড হচ্ছে..." : "Downloading update in background...",
                  schedule: { at: new Date(Date.now() + 500) },
                  smallIcon: "ic_launcher_foreground",
                },
              ],
            });
          } catch {}

          try {
            const dlResult = await AppUpdater.downloadUpdate({ url: APK_DOWNLOAD_URL });
            if (dlResult?.success && isMounted) {
              setModalState("ready_to_install");

              // Status bar notification that it's ready to install
              try {
                await LocalNotifications.schedule({
                  notifications: [
                    {
                      id: 992,
                      title: `🎉 Digital Somity ${displayVer} Ready`,
                      body: language === "bn" ? "আপডেট ডাউনলোড শেষ। ইনস্টল করতে ট্যাপ করুন।" : "Update downloaded. Tap to install now.",
                      schedule: { at: new Date(Date.now() + 500) },
                      smallIcon: "ic_launcher_foreground",
                    },
                  ],
                });
              } catch {}
            }
          } catch (dlErr) {
            console.warn("Background auto-download failed:", dlErr);
            if (isMounted) setModalState("hidden");
          }
        }
      } catch (err) {
        console.warn("Update check failed:", err);
      }
    };

    const timer = setTimeout(checkUpdates, 1500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [language]);

  const handleInstallClick = async () => {
    setModalState("installing");
    try {
      const res = await AppUpdater.installUpdate();
      if (!res?.success && !res?.needPermission) {
        setModalState("ready_to_install");
      }
    } catch (err) {
      console.error("Install launch error:", err);
      setModalState("ready_to_install");
    }
  };

  const handleReloadClick = () => {
    // Clear cache & hard reload on web
    try {
      if ("caches" in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        });
      }
    } catch {}
    window.location.reload();
  };

  if (modalState === "hidden") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.78)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999999,
        padding: "20px",
        animation: "fadeIn 0.25s ease-out",
        userSelect: "none",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "350px",
          backgroundColor: "var(--color-surface, #0E131F)",
          border: "1px solid rgba(15, 91, 228, 0.35)",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(15, 91, 228, 0.25)",
          borderRadius: "22px",
          padding: "26px 22px 22px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "14px",
          position: "relative",
        }}
      >
        {/* Dismiss button (for web reload or downloading dismiss) */}
        {!Capacitor.isNativePlatform() && (
          <button
            type="button"
            onClick={() => setModalState("hidden")}
            style={{
              position: "absolute",
              top: "14px",
              right: "14px",
              background: "rgba(255, 255, 255, 0.06)",
              border: "none",
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--color-text-muted, #94A3B8)",
            }}
            title="Dismiss"
          >
            <X size={15} />
          </button>
        )}

        {/* Dynamic State Icon */}
        <div
          style={{
            width: "66px",
            height: "66px",
            borderRadius: "18px",
            background: "linear-gradient(135deg, rgba(15, 91, 228, 0.25) 0%, rgba(56, 189, 248, 0.2) 100%)",
            border: "1px solid rgba(56, 189, 248, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-brand-variant, #38BDF8)",
            boxShadow: "0 10px 25px rgba(15, 91, 228, 0.35)",
          }}
        >
          {modalState === "downloading" ? (
            <Loader2 size={32} style={{ animation: "spin 1.2s linear infinite" }} />
          ) : modalState === "ready_to_install" || modalState === "installing" ? (
            <CheckCircle2 size={34} style={{ color: "#10B981" }} />
          ) : (
            <ArrowUpCircle size={34} />
          )}
        </div>

        {/* Version Badge & Title */}
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "999px",
              backgroundColor: "rgba(15, 91, 228, 0.15)",
              color: "#38BDF8",
              fontSize: "12px",
              fontWeight: 600,
              marginBottom: "8px",
            }}
          >
            <Sparkles size={12} />
            <span>
              {modalState === "web_reload_ready"
                ? (language === "bn" ? `নতুন ভার্সন ${targetVersion}` : `New Version ${targetVersion}`)
                : modalState === "downloading"
                ? (language === "bn" ? `ভার্সন ${targetVersion} ডাউনলোড হচ্ছে` : `Downloading ${targetVersion}`)
                : (language === "bn" ? `ভার্সন ${targetVersion} প্রস্তুত` : `Version ${targetVersion} Ready`)}
            </span>
          </div>

          <h3
            style={{
              margin: 0,
              fontSize: "19px",
              fontWeight: 700,
              color: "var(--color-text-primary, #FFFFFF)",
              letterSpacing: "-0.01em",
            }}
          >
            {modalState === "web_reload_ready"
              ? (language === "bn" ? "নতুন আপডেট উপলব্ধ" : "Web Update Available")
              : modalState === "downloading"
              ? (language === "bn" ? "স্বয়ংক্রিয় ডাউনলোড চলছে" : "Downloading Update")
              : (language === "bn" ? "আপডেট ইনস্টল করতে প্রস্তুত" : "Ready to Install")}
          </h3>
        </div>

        {/* Commit / Update Details */}
        {commitSummary && (
          <p
            style={{
              margin: 0,
              fontSize: "12.5px",
              lineHeight: "1.45",
              color: "var(--color-text-secondary, #94A3B8)",
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              padding: "9px 12px",
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              width: "100%",
              wordBreak: "break-word",
            }}
          >
            {commitSummary}
          </p>
        )}

        {/* ── State 1: DOWNLOADING (APK) ── */}
        {modalState === "downloading" && (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px", marginTop: "2px" }}>
            <div
              style={{
                width: "100%",
                height: "4px",
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
                  bottom: 0,
                  width: "45%",
                  backgroundColor: "#0F5BE4",
                  borderRadius: "999px",
                  animation: "downloadShimmer 1.2s infinite ease-in-out",
                }}
              />
            </div>
            <span style={{ fontSize: "12px", color: "var(--color-text-muted, #64748B)" }}>
              {language === "bn"
                ? "ব্যাকগ্রাউন্ডে ডাউনলোড হচ্ছে... শেষ হলে ইনস্টল করতে বলা হবে।"
                : "Downloading in background... You will be prompted to install once ready."}
            </span>
          </div>
        )}

        {/* ── State 2: READY TO INSTALL (APK) — Only asks to install, starts install directly ── */}
        {(modalState === "ready_to_install" || modalState === "installing") && (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
            <button
              type="button"
              onClick={handleInstallClick}
              disabled={modalState === "installing"}
              style={{
                width: "100%",
                padding: "14px 18px",
                background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: 700,
                cursor: modalState === "installing" ? "wait" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 6px 20px rgba(16, 185, 129, 0.4)",
                outline: "none",
                transition: "all 0.2s ease",
              }}
            >
              <Download size={18} />
              <span>
                {modalState === "installing"
                  ? (language === "bn" ? "ইনস্টলার খুলছে..." : "Opening Installer...")
                  : (language === "bn" ? `ইনস্টল করুন (${targetVersion})` : `Install Update (${targetVersion})`)}
              </span>
            </button>
            <span style={{ fontSize: "11px", color: "var(--color-text-muted, #64748B)" }}>
              {language === "bn"
                ? "ট্যাপ করলে অ্যান্ড্রয়েড প্যাকেজ ইনস্টলার চালু হবে।"
                : "Tapping will start the Android package installer."}
            </span>
          </div>
        )}

        {/* ── State 3: WEB RELOAD (Web version) ── */}
        {modalState === "web_reload_ready" && (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
            <button
              type="button"
              onClick={handleReloadClick}
              style={{
                width: "100%",
                padding: "13px 18px",
                background: "linear-gradient(135deg, #0F5BE4 0%, #2563EB 100%)",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 6px 20px rgba(15, 91, 228, 0.4)",
                outline: "none",
              }}
            >
              <RefreshCw size={16} />
              <span>{language === "bn" ? `রিলোড করুন (${targetVersion})` : `Reload Page (${targetVersion})`}</span>
            </button>
            <span style={{ fontSize: "11px", color: "var(--color-text-muted, #64748B)" }}>
              {language === "bn"
                ? "নতুন ফিচার ও উন্নয়ন পেতে পেজটি রিলোড করুন।"
                : "Reload the page to apply the latest features and fixes."}
            </span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes downloadShimmer {
          0%   { left: -45%; width: 45%; }
          50%  { width: 60%; }
          100% { left: 100%; width: 45%; }
        }
      `}</style>
    </div>
  );
};
