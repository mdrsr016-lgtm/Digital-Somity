import { Capacitor } from "@capacitor/core";
import { DeviceUnlock } from "../plugins/DeviceUnlock";

const PREF_KEY = "ds_app_lock_enabled";
const AUTH_TIMEOUT_MS = 45_000;

/** App lock is ON by default on native builds. */
export function isAppLockEnabled(): boolean {
  if (!Capacitor.isNativePlatform()) return false;
  const stored = localStorage.getItem(PREF_KEY);
  return stored === null ? true : stored === "1";
}

export function setAppLockEnabled(enabled: boolean): void {
  localStorage.setItem(PREF_KEY, enabled ? "1" : "0");
}

export async function canUseDeviceUnlock(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const info = await DeviceUnlock.canAuthenticate();
    return Boolean(info.canAuthenticate);
  } catch {
    return false;
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms}ms`));
    }, ms);
    promise.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        window.clearTimeout(timer);
        reject(err);
      }
    );
  });
}

/**
 * Prompt for fingerprint / face / device PIN-password.
 * Returns true when unlocked (or when lock is unavailable / disabled).
 */
export async function authenticateDeviceUnlock(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return true;
  if (!isAppLockEnabled()) return true;

  try {
    const info = await withTimeout(
      DeviceUnlock.canAuthenticate(),
      5000,
      "canAuthenticate"
    );
    if (!info.canAuthenticate) {
      // No biometrics and no device PIN — don't brick the app.
      return true;
    }

    await withTimeout(
      DeviceUnlock.authenticate({
        title: "Unlock Digital Somity",
        subtitle: "Use fingerprint, face, or your device PIN / password",
        reason: "Unlock Digital Somity to continue",
        allowDeviceCredential: true,
      }),
      AUTH_TIMEOUT_MS,
      "authenticate"
    );
    return true;
  } catch (err) {
    const code =
      typeof err === "object" && err && "code" in err
        ? String((err as { code?: string }).code || "")
        : "";

    if (
      code === "userCancel" ||
      code === "systemCancel" ||
      code === "superseded"
    ) {
      return false;
    }

    console.warn("Device unlock failed:", err);
    return false;
  }
}
