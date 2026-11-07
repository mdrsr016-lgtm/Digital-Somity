import { Capacitor } from "@capacitor/core";
import {
  APP_VERSION,
  CURRENT_BUILD_SHA,
  LIVE_APP_URL,
  VERSION_CHECK_URL,
} from "../constants/appVersion";

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
 * Reload the Capacitor WebView onto the published GitHub Pages build when
 * the live site reports a newer version or a different build SHA.
 */
export async function applyLiveUpdate(): Promise<boolean> {
  if (import.meta.env.DEV || !Capacitor.isNativePlatform()) return false;

  const response = await fetch(`${VERSION_CHECK_URL}?_t=${Date.now()}`, {
    cache: "no-store",
    headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
  });
  if (!response.ok) return false;

  const data = await response.json();
  const remoteVer = String(data?.version || "");
  const remoteSha = String(data?.sha || "");
  if (!remoteVer) return false;

  const versionNewer = isNewerVersion(remoteVer, APP_VERSION);
  const shaChanged = Boolean(remoteSha) && remoteSha !== CURRENT_BUILD_SHA;
  if (!versionNewer && !shaChanged) return false;

  const current = new URL(window.location.href);
  const alreadyOnBuild = current.searchParams.get("build") === (remoteSha || remoteVer);
  // Only skip when this document is already the new build (version matches too).
  if (alreadyOnBuild && !versionNewer) return false;

  const next = new URL(LIVE_APP_URL);
  next.searchParams.set("v", remoteVer);
  next.searchParams.set("build", remoteSha || remoteVer);
  next.searchParams.set("_", String(Date.now()));
  window.location.replace(next.toString());
  return true;
}
