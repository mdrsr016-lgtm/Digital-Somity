package com.digitalsomity.app;

import android.app.KeyguardManager;
import android.content.Context;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import androidx.annotation.NonNull;
import androidx.biometric.BiometricManager;
import androidx.biometric.BiometricPrompt;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentActivity;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.concurrent.Executor;

/**
 * Shows the system fingerprint / face / PIN prompt on the main Capacitor
 * activity (no separate AuthActivity). This avoids the hanging "Waiting…"
 * state caused by transparent secondary activities on many OEM devices.
 */
@CapacitorPlugin(name = "DeviceUnlock")
public class DeviceUnlockPlugin extends Plugin {

    private PluginCall pendingCall;

    @PluginMethod
    public void canAuthenticate(PluginCall call) {
        try {
            Context context = getContext();
            BiometricManager manager = BiometricManager.from(context);
            int biometric = manager.canAuthenticate(
                BiometricManager.Authenticators.BIOMETRIC_WEAK
            );
            boolean biometryAvailable =
                biometric == BiometricManager.BIOMETRIC_SUCCESS;

            KeyguardManager keyguard =
                (KeyguardManager) context.getSystemService(Context.KEYGUARD_SERVICE);
            boolean deviceIsSecure =
                keyguard != null && keyguard.isKeyguardSecure();

            int combined = manager.canAuthenticate(
                BiometricManager.Authenticators.BIOMETRIC_WEAK |
                BiometricManager.Authenticators.DEVICE_CREDENTIAL
            );
            boolean canAuth =
                combined == BiometricManager.BIOMETRIC_SUCCESS ||
                biometryAvailable ||
                deviceIsSecure;

            JSObject ret = new JSObject();
            ret.put("canAuthenticate", canAuth);
            ret.put("biometryAvailable", biometryAvailable);
            ret.put("deviceIsSecure", deviceIsSecure);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("canAuthenticate failed: " + e.getMessage(), "checkFailed");
        }
    }

    @PluginMethod
    public void authenticate(PluginCall call) {
        if (pendingCall != null) {
            pendingCall.reject("Replaced by a newer unlock request", "superseded");
            pendingCall = null;
        }

        FragmentActivity activity = getFragmentActivity();
        if (activity == null) {
            call.reject("Main activity is not ready", "noActivity");
            return;
        }

        pendingCall = call;

        final String title = call.getString("title", "Unlock Digital Somity");
        final String subtitle = call.getString(
            "subtitle",
            "Use fingerprint, face, or your device PIN / password"
        );
        final String reason = call.getString(
            "reason",
            "Unlock Digital Somity to continue"
        );
        final boolean allowDeviceCredential = Boolean.TRUE.equals(
            call.getBoolean("allowDeviceCredential", true)
        );

        activity.runOnUiThread(() -> {
            try {
                showPrompt(activity, title, subtitle, reason, allowDeviceCredential);
            } catch (Exception e) {
                finishWithReject(e.getMessage(), "authError");
            }
        });
    }

    private void showPrompt(
        FragmentActivity activity,
        String title,
        String subtitle,
        String reason,
        boolean allowDeviceCredential
    ) {
        Executor executor = ContextCompat.getMainExecutor(activity);

        BiometricPrompt.AuthenticationCallback callback =
            new BiometricPrompt.AuthenticationCallback() {
                @Override
                public void onAuthenticationError(
                    int errorCode,
                    @NonNull CharSequence errString
                ) {
                    String code = mapErrorCode(errorCode);
                    finishWithReject(
                        errString != null ? errString.toString() : "Authentication error",
                        code
                    );
                }

                @Override
                public void onAuthenticationSucceeded(
                    @NonNull BiometricPrompt.AuthenticationResult result
                ) {
                    finishWithResolve();
                }

                @Override
                public void onAuthenticationFailed() {
                    // Keep the prompt open; system will retry / fall back.
                }
            };

        BiometricPrompt prompt = new BiometricPrompt(activity, executor, callback);

        BiometricPrompt.PromptInfo.Builder builder =
            new BiometricPrompt.PromptInfo.Builder()
                .setTitle(title != null && !title.isEmpty() ? title : "Authenticate")
                .setSubtitle(subtitle)
                .setDescription(reason)
                .setConfirmationRequired(false);

        int authenticators = BiometricManager.Authenticators.BIOMETRIC_WEAK;

        // BIOMETRIC_STRONG | DEVICE_CREDENTIAL is invalid on API 28-29.
        // WEAK | DEVICE_CREDENTIAL works across supported API levels.
        if (allowDeviceCredential) {
            authenticators |= BiometricManager.Authenticators.DEVICE_CREDENTIAL;
        } else {
            builder.setNegativeButtonText("Cancel");
        }

        // If biometrics are unavailable but device has a PIN, allow credential-only.
        BiometricManager manager = BiometricManager.from(activity);
        int bioOnly = manager.canAuthenticate(
            BiometricManager.Authenticators.BIOMETRIC_WEAK
        );
        if (
            allowDeviceCredential &&
            bioOnly != BiometricManager.BIOMETRIC_SUCCESS
        ) {
            KeyguardManager keyguard =
                (KeyguardManager) activity.getSystemService(Context.KEYGUARD_SERVICE);
            if (keyguard != null && keyguard.isKeyguardSecure()) {
                authenticators = BiometricManager.Authenticators.DEVICE_CREDENTIAL;
            }
        }

        builder.setAllowedAuthenticators(authenticators);
        BiometricPrompt.PromptInfo info = builder.build();

        // Post so the activity has focus after splash / first paint.
        Runnable start = () -> {
            if (activity.isFinishing() || activity.isDestroyed()) {
                finishWithReject("Activity closed", "noActivity");
                return;
            }
            prompt.authenticate(info);
        };

        if (Build.VERSION.SDK_INT >= 28) {
            activity.getWindow().getDecorView().post(start);
        } else {
            new Handler(Looper.getMainLooper()).post(start);
        }
    }

    private FragmentActivity getFragmentActivity() {
        if (getActivity() instanceof FragmentActivity) {
            return (FragmentActivity) getActivity();
        }
        return null;
    }

    private String mapErrorCode(int errorCode) {
        switch (errorCode) {
            case BiometricPrompt.ERROR_USER_CANCELED:
            case BiometricPrompt.ERROR_NEGATIVE_BUTTON:
                return "userCancel";
            case BiometricPrompt.ERROR_CANCELED:
                return "systemCancel";
            case BiometricPrompt.ERROR_LOCKOUT:
            case BiometricPrompt.ERROR_LOCKOUT_PERMANENT:
                return "lockout";
            case BiometricPrompt.ERROR_NO_BIOMETRICS:
            case BiometricPrompt.ERROR_NO_DEVICE_CREDENTIAL:
                return "notAvailable";
            case BiometricPrompt.ERROR_HW_UNAVAILABLE:
            case BiometricPrompt.ERROR_HW_NOT_PRESENT:
                return "notAvailable";
            default:
                return "authError";
        }
    }

    private void finishWithResolve() {
        PluginCall call = pendingCall;
        pendingCall = null;
        if (call != null) {
            call.resolve();
        }
    }

    private void finishWithReject(String message, String code) {
        PluginCall call = pendingCall;
        pendingCall = null;
        if (call != null) {
            call.reject(message, code);
        }
    }
}
