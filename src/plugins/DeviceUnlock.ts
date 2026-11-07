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
}

export interface DeviceUnlockPlugin {
  canAuthenticate(): Promise<DeviceUnlockCanAuthenticateResult>;
  authenticate(options?: DeviceUnlockAuthenticateOptions): Promise<void>;
}

export const DeviceUnlock = registerPlugin<DeviceUnlockPlugin>("DeviceUnlock");
