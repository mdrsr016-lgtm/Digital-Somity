import { Capacitor } from "@capacitor/core";
import { BiometricAuth, BiometryError } from "@aparajita/capacitor-biometric-auth";

const PREF_KEY = "ds_app_lock_enabled";

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

/**
 * Prompt for fingerprint / face / device PIN-password.
 * Returns true when unlocked (or when lock is unavailable / disabled).
 */
export async function authenticateDeviceUnlock(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return true;
  if (!isAppLockEnabled()) return true;

  try {
    const info = await BiometricAuth.checkBiometry();
    if (!info.isAvailable && !info.deviceIsSecure) {
      // No biometrics and no device PIN — don't brick the app.
      return true;
    }

    await BiometricAuth.authenticate({
      reason: "Unlock Digital Somity to continue",
      allowDeviceCredential: true,
      androidTitle: "Unlock Digital Somity",
      androidSubtitle: "Use fingerprint, face, or your device PIN / password",
      cancelTitle: "Cancel",
      androidConfirmationRequired: false,
    });
    return true;
  } catch (err) {
    if (err instanceof BiometryError) {
      // userCancel / systemCancel → stay locked
      return false;
    }
    console.warn("Device unlock failed:", err);
    return false;
  }
}
