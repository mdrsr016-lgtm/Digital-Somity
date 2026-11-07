import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";
import {
  AndroidBiometryStrength,
  BiometricAuth,
  BiometryError,
} from "@aparajita/capacitor-biometric-auth";

const PREF_KEY = "ds_app_lock_enabled";
const AUTH_TIMEOUT_MS = 20_000;

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
    const info = await BiometricAuth.checkBiometry();
    return Boolean(info.isAvailable || info.deviceIsSecure);
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

/** Wait until the Capacitor activity is in the foreground. */
export async function waitForAppActive(maxMs = 4000): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  const started = Date.now();
  while (Date.now() - started < maxMs) {
    try {
      const state = await CapApp.getState();
      if (state.isActive) return;
    } catch {
      return;
    }
    await new Promise((r) => setTimeout(r, 120));
  }
}

/**
 * Prompt for fingerprint / face / device PIN-password.
 * Returns true when unlocked (or when lock is unavailable / disabled).
 */
export async function authenticateDeviceUnlock(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return true;
  if (!isAppLockEnabled()) return true;

  try {
    await waitForAppActive();

    const info = await withTimeout(BiometricAuth.checkBiometry(), 5000, "checkBiometry");
    if (!info.isAvailable && !info.deviceIsSecure) {
      // No biometrics and no device PIN — don't brick the app.
      return true;
    }

    // Brief settle so AuthActivity is not started mid-transition.
    await new Promise((r) => setTimeout(r, 250));

    await withTimeout(
      BiometricAuth.authenticate({
        reason: "Unlock Digital Somity to continue",
        allowDeviceCredential: true,
        androidTitle: "Unlock Digital Somity",
        androidSubtitle: "Use fingerprint, face, or your device PIN / password",
        cancelTitle: "Cancel",
        androidConfirmationRequired: false,
        androidBiometryStrength: AndroidBiometryStrength.weak,
      }),
      AUTH_TIMEOUT_MS,
      "authenticate"
    );
    return true;
  } catch (err) {
    const code =
      err instanceof BiometryError
        ? err.code
        : typeof err === "object" && err && "code" in err
          ? String((err as { code?: string }).code || "")
          : "";

    // User/system cancel → stay locked
    if (
      code === "userCancel" ||
      code === "systemCancel" ||
      code === "appCancel" ||
      code === "userFallback"
    ) {
      return false;
    }

    console.warn("Device unlock failed:", err);
    return false;
  }
}
