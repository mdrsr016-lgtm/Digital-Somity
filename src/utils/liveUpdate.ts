import { Capacitor } from "@capacitor/core";
import { APP_VERSION, LIVE_APP_URL, VERSION_CHECK_URL } from "../constants/appVersion";

function isNewerVersion(remote: string, local: string): boolean {
  if (!remote || !local) return false;
  const clean = (v: string) => v.trim().replace(/^v/i, "").split("-")[0];
  const rParts = clean(remote).split(".").map((n) => parseInt(n, 10) || 0);
  const lParts = clean(local).split(".").map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < 3; i++) {
    const r = rParts[i] ?? 0;
    const l = lParts[i] ?? 0;
    if (r > l) return true;
    if (r < l) return false;
  }
  return false;
}

/**
 * If GitHub has a newer build, open it in place.
 * No APK install — the WebView just loads the published site.
 */
export async function applyLiveUpdate(): Promise<boolean> {
  if (import.meta.env.DEV || !Capacitor.isNativePlatform()) return false;

  const response = await fetch(`${VERSION_CHECK_URL}?_t=${Date.now()}`, {
    cache: "no-store",
    headers: { "Cache-Control": "no-cache" },
  });
  if (!response.ok) return false;

  const data = await response.json();
  const remoteVer = String(data?.version || "");
  if (!isNewerVersion(remoteVer, APP_VERSION)) return false;

  const current = new URL(window.location.href);
  if (current.searchParams.get("v") === remoteVer) return false;

  const next = new URL(LIVE_APP_URL);
  next.searchParams.set("v", remoteVer);
  window.location.replace(next.toString());
  return true;
}
