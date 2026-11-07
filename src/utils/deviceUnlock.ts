import { Capacitor } from "@capacitor/core";
import { DeviceUnlock } from "../plugins/DeviceUnlock";

const PREF_KEY = "ds_app_lock_enabled";
const AUTH_TIMEOUT_MS = 60_000;

export type UnlockAttemptResult = {
  ok: boolean;
  code?: string;
  message?: string;
};

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

/** Ask for notification (and other) runtime permissions once at launch. */
export async function requestStartupPermissions(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await DeviceUnlock.requestStartupPermissions();
  } catch (err) {
    console.warn("Startup permissions:", err);
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(Object.assign(new Error(`${label} timed out after ${ms}ms`), { code: "timeout" }));
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

function errParts(err: unknown): { code: string; message: string } {
  if (typeof err === "object" && err) {
    const code = "code" in err ? String((err as { code?: string }).code || "") : "";
    const message =
      "message" in err
        ? String((err as { message?: string }).message || "")
        : String(err);
    return { code, message };
  }
  return { code: "", message: String(err) };
}

/**
 * Prompt for fingerprint / face / device PIN-password.
 */
export async function authenticateDeviceUnlock(options?: {
  preferDeviceCredential?: boolean;
}): Promise<UnlockAttemptResult> {
  if (!Capacitor.isNativePlatform()) return { ok: true };
  if (!isAppLockEnabled()) return { ok: true };

  try {
    const info = await withTimeout(
      DeviceUnlock.canAuthenticate(),
      5000,
      "canAuthenticate"
    );
    if (!info.canAuthenticate) {
      return { ok: true, code: "notRequired", message: "No device lock configured" };
    }

    await withTimeout(
      DeviceUnlock.authenticate({
        title: "Unlock Digital Somity",
        subtitle: "Use fingerprint, face, or your device PIN / password",
        reason: "Unlock Digital Somity to continue",
        allowDeviceCredential: true,
        preferDeviceCredential: options?.preferDeviceCredential === true,
      }),
      AUTH_TIMEOUT_MS,
      "authenticate"
    );
    return { ok: true };
  } catch (err) {
    const { code, message } = errParts(err);
    console.warn("Device unlock failed:", code, message, err);
    return { ok: false, code, message };
  }
}
