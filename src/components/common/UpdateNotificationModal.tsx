import React, { useState, useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Sparkles, Download, ArrowUpCircle } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { CURRENT_BUILD_SHA, GITHUB_REPO_OWNER, GITHUB_REPO_NAME, APK_DOWNLOAD_URL } from "../../constants/appVersion";

export const UpdateNotificationModal: React.FC = () => {
  const { language } = useLanguage();
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateDetails, setUpdateDetails] = useState<string>("");
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // Only check for APK updates when running on native Android APK
    if (!Capacitor.isNativePlatform()) return;

    let isMounted = true;

    const checkForUpdate = async () => {
      try {
        const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/commits/main`, {
          headers: {
            "Accept": "application/vnd.github.v3+json",
          },
        });

        if (!res.ok) return;

        const data = await res.json();
        const latestSha = data?.sha;
        const commitMsg = data?.commit?.message?.split("\n")[0] || "New updates and performance improvements";

        if (latestSha && latestSha !== CURRENT_BUILD_SHA) {
          if (isMounted) {
            setUpdateAvailable(true);
            setUpdateDetails(commitMsg);

            // Trigger notification in phone's notification bar
            try {
              const perm = await LocalNotifications.checkPermissions();
              if (perm.display !== "granted") {
                await LocalNotifications.requestPermissions();
              }
              await LocalNotifications.schedule({
                notifications: [
                  {
                    id: 991,
                    title: "⚡ Digital Somity Update Available",
                    body: "A new update has been pushed. Tap to install now.",
                    schedule: { at: new Date(Date.now() + 500) },
                    smallIcon: "ic_launcher_foreground",
                  },
                ],
              });
            } catch (notifyErr) {
              console.warn("Could not post system notification:", notifyErr);
            }
          }
        }
      } catch (err) {
        console.warn("Update check failed:", err);
      }
    };

    // Check immediately on app open
    checkForUpdate();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleInstallUpdate = () => {
    setIsDownloading(true);

    // Trigger direct APK download via Android DownloadManager
    try {
      window.location.href = APK_DOWNLOAD_URL;
    } catch {
      window.open(APK_DOWNLOAD_URL, "_system");
    }
  };

  if (!updateAvailable) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999999,
        padding: "20px",
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "340px",
          backgroundColor: "var(--color-surface, #0E131F)",
          border: "1px solid rgba(15, 91, 228, 0.35)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(15, 91, 228, 0.25)",
          borderRadius: "20px",
          padding: "24px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "14px",
          userSelect: "none",
        }}
      >
        {/* Animated Badge Icon */}
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, rgba(15, 91, 228, 0.25) 0%, rgba(56, 189, 248, 0.2) 100%)",
            border: "1px solid rgba(56, 189, 248, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-brand-variant, #38BDF8)",
            boxShadow: "0 8px 20px rgba(15, 91, 228, 0.35)",
          }}
        >
          <ArrowUpCircle size={32} />
        </div>

        {/* Title & Tag */}
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "3px 8px",
              borderRadius: "999px",
              backgroundColor: "rgba(15, 91, 228, 0.15)",
              color: "#38BDF8",
              fontSize: "11px",
              fontWeight: 600,
              marginBottom: "6px",
            }}
          >
            <Sparkles size={11} />
            <span>{language === "bn" ? "নতুন ভার্সন প্রস্তুত" : "New Push Detected"}</span>
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
            {language === "bn" ? "অ্যাপ আপডেট উপলব্ধ" : "Update Available"}
          </h3>
        </div>

        {/* Change description */}
        <p
          style={{
            margin: 0,
            fontSize: "12.5px",
            lineHeight: "1.45",
            color: "var(--color-text-secondary, #94A3B8)",
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            padding: "10px 12px",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            width: "100%",
            wordBreak: "break-word",
          }}
        >
          {updateDetails || (language === "bn" ? "নতুন বৈশিষ্ট্য ও উন্নয়ন যুক্ত করা হয়েছে।" : "Latest improvements and updates are ready to install.")}
        </p>

        {/* The Single "Install Update" Button */}
        <button
          type="button"
          onClick={handleInstallUpdate}
          disabled={isDownloading}
          style={{
            width: "100%",
            marginTop: "6px",
            padding: "13px 16px",
            background: isDownloading
              ? "rgba(15, 91, 228, 0.6)"
              : "linear-gradient(135deg, #0F5BE4 0%, #2563EB 100%)",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: isDownloading ? "wait" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            boxShadow: "0 6px 20px rgba(15, 91, 228, 0.45)",
            transition: "all 0.2s ease",
            outline: "none",
          }}
        >
          <Download size={16} />
          <span>
            {isDownloading
              ? (language === "bn" ? "ডাউনলোড হচ্ছে... নোটিফিকেশন দেখুন" : "Downloading... check notification bar")
              : (language === "bn" ? "আপডেট ইনস্টল করুন" : "Install Update")}
          </span>
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

