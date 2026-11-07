import { registerPlugin } from "@capacitor/core";

export interface DeviceUnlockCanAuthenticateResult {
  canAuthenticate: boolean;
  biometryAvailable: boolean;
  deviceIsSecure: boolean;
}

export interface DeviceUnlockAuthenticateOptions {
  title?: string;
  subtitle?: string;
  reason?: string;
  allowDeviceCredential?: boolean;
  /** Prefer the system PIN/pattern screen instead of biometrics first. */
  preferDeviceCredential?: boolean;
}

export interface DeviceUnlockStartupPermissionsResult {
  notifications: "granted" | "denied" | string;
  requested: boolean;
}

export interface DeviceUnlockPlugin {
  canAuthenticate(): Promise<DeviceUnlockCanAuthenticateResult>;
  authenticate(options?: DeviceUnlockAuthenticateOptions): Promise<void>;
  requestStartupPermissions(): Promise<DeviceUnlockStartupPermissionsResult>;
  openSecuritySettings(): Promise<void>;
}

export const DeviceUnlock = registerPlugin<DeviceUnlockPlugin>("DeviceUnlock");
