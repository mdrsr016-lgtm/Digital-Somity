package com.digitalsomity.app;

import android.Manifest;
import android.app.Activity;
import android.app.KeyguardManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import androidx.activity.result.ActivityResult;
import androidx.annotation.NonNull;
import androidx.biometric.BiometricManager;
import androidx.biometric.BiometricPrompt;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentActivity;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Executor;

/**
 * Device unlock using BiometricPrompt on MainActivity, with Keyguard PIN
 * fallback. Also requests runtime permissions needed at launch.
 */
@CapacitorPlugin(
    name = "DeviceUnlock",
    permissions = {
        @Permission(
            alias = "notifications",
            strings = { Manifest.permission.POST_NOTIFICATIONS }
        )
    }
)
public class DeviceUnlockPlugin extends Plugin {

    private PluginCall pendingCall;
    private BiometricPrompt activePrompt;

    @PluginMethod
    public void requestStartupPermissions(PluginCall call) {
        List<String> needed = new ArrayList<>();

        if (Build.VERSION.SDK_INT >= 33) {
            if (
                ContextCompat.checkSelfPermission(
                    getContext(),
                    Manifest.permission.POST_NOTIFICATIONS
                ) !=
                PackageManager.PERMISSION_GRANTED
            ) {
                needed.add(Manifest.permission.POST_NOTIFICATIONS);
            }
        }

        if (needed.isEmpty()) {
            JSObject ret = new JSObject();
            ret.put("notifications", "granted");
            ret.put("requested", false);
            call.resolve(ret);
            return;
        }

        requestPermissionForAlias("notifications", call, "startupPermsCallback");
    }

    @PermissionCallback
    private void startupPermsCallback(PluginCall call) {
        JSObject ret = new JSObject();
        if (Build.VERSION.SDK_INT >= 33) {
            boolean granted =
                ContextCompat.checkSelfPermission(
                    getContext(),
                    Manifest.permission.POST_NOTIFICATIONS
                ) ==
                PackageManager.PERMISSION_GRANTED;
            ret.put("notifications", granted ? "granted" : "denied");
        } else {
            ret.put("notifications", "granted");
        }
        ret.put("requested", true);
        call.resolve(ret);
    }

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
        // Cancel any previous prompt cleanly before starting a new one.
        if (activePrompt != null) {
            try {
                activePrompt.cancelAuthentication();
            } catch (Exception ignored) {}
            activePrompt = null;
        }
        if (pendingCall != null) {
            pendingCall.reject("Replaced by a newer unlock request", "superseded");
            pendingCall = null;
        }

        FragmentActivity activity = getFragmentActivity();
        if (activity == null) {
            call.reject("Main activity is not ready", "noActivity");
            return;
        }

        if (activity.isFinishing() || activity.isDestroyed()) {
            call.reject("Main activity is closing", "noActivity");
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
        final boolean preferCredential = Boolean.TRUE.equals(
            call.getBoolean("preferDeviceCredential", false)
        );

        activity.runOnUiThread(() -> {
            try {
                if (preferCredential && allowDeviceCredential) {
                    if (launchDeviceCredential(activity, title, reason, call)) {
                        return;
                    }
                }
                showBiometricPrompt(
                    activity,
                    title,
                    subtitle,
                    reason,
                    allowDeviceCredential,
                    call
                );
            } catch (Exception e) {
                // Last resort: system PIN / pattern screen.
                if (
                    allowDeviceCredential &&
                    launchDeviceCredential(activity, title, reason, call)
                ) {
                    return;
                }
                finishWithReject(
                    e.getMessage() != null ? e.getMessage() : "auth failed",
                    "authError"
                );
            }
        });
    }

    private void showBiometricPrompt(
        FragmentActivity activity,
        String title,
        String subtitle,
        String reason,
        boolean allowDeviceCredential,
        PluginCall originalCall
    ) {
        Executor executor = ContextCompat.getMainExecutor(activity);

        BiometricPrompt.AuthenticationCallback callback =
            new BiometricPrompt.AuthenticationCallback() {
                @Override
                public void onAuthenticationError(
                    int errorCode,
                    @NonNull CharSequence errString
                ) {
                    activePrompt = null;
                    // If biometric UI was cancelled by the system, fall back to PIN screen.
                    if (
                        allowDeviceCredential &&
                        (errorCode == BiometricPrompt.ERROR_CANCELED ||
                            errorCode == BiometricPrompt.ERROR_HW_UNAVAILABLE ||
                            errorCode == BiometricPrompt.ERROR_UNABLE_TO_PROCESS ||
                            errorCode == BiometricPrompt.ERROR_TIMEOUT ||
                            errorCode == BiometricPrompt.ERROR_NO_BIOMETRICS)
                    ) {
                        if (
                            launchDeviceCredential(
                                activity,
                                title,
                                reason,
                                originalCall
                            )
                        ) {
                            return;
                        }
                    }
                    finishWithReject(
                        errString != null
                            ? errString.toString()
                            : "Authentication error",
                        mapErrorCode(errorCode)
                    );
                }

                @Override
                public void onAuthenticationSucceeded(
                    @NonNull BiometricPrompt.AuthenticationResult result
                ) {
                    activePrompt = null;
                    finishWithResolve();
                }

                @Override
                public void onAuthenticationFailed() {
                    // Keep prompt open for retry / device-credential button.
                }
            };

        activePrompt = new BiometricPrompt(activity, executor, callback);

        BiometricPrompt.PromptInfo.Builder builder =
            new BiometricPrompt.PromptInfo.Builder()
                .setTitle(
                    title != null && !title.isEmpty() ? title : "Authenticate"
                )
                .setSubtitle(subtitle)
                .setDescription(reason)
                .setConfirmationRequired(false);

        int authenticators = BiometricManager.Authenticators.BIOMETRIC_WEAK;
        BiometricManager manager = BiometricManager.from(activity);
        int bioOnly = manager.canAuthenticate(
            BiometricManager.Authenticators.BIOMETRIC_WEAK
        );

        if (allowDeviceCredential) {
            if (bioOnly == BiometricManager.BIOMETRIC_SUCCESS) {
                authenticators =
                    BiometricManager.Authenticators.BIOMETRIC_WEAK |
                    BiometricManager.Authenticators.DEVICE_CREDENTIAL;
            } else {
                authenticators =
                    BiometricManager.Authenticators.DEVICE_CREDENTIAL;
            }
        } else {
            builder.setNegativeButtonText("Cancel");
        }

        builder.setAllowedAuthenticators(authenticators);
        final BiometricPrompt.PromptInfo info = builder.build();

        Runnable start = () -> {
            if (activity.isFinishing() || activity.isDestroyed()) {
                finishWithReject("Activity closed", "noActivity");
                return;
            }
            try {
                activePrompt.authenticate(info);
            } catch (Exception e) {
                if (
                    allowDeviceCredential &&
                    launchDeviceCredential(activity, title, reason, originalCall)
                ) {
                    return;
                }
                finishWithReject(
                    e.getMessage() != null ? e.getMessage() : "prompt failed",
                    "authError"
                );
            }
        };

        // Delay slightly so splash / permission dialogs don't cancel the prompt.
        new Handler(Looper.getMainLooper()).postDelayed(start, 180);
    }

    /**
     * System lock-screen credential (PIN / pattern / password).
     * More reliable than BiometricPrompt on some OEM devices.
     */
    private boolean launchDeviceCredential(
        FragmentActivity activity,
        String title,
        String reason,
        PluginCall call
    ) {
        try {
            KeyguardManager keyguard =
                (KeyguardManager) activity.getSystemService(
                    Context.KEYGUARD_SERVICE
                );
            if (keyguard == null || !keyguard.isKeyguardSecure()) {
                return false;
            }

            @SuppressWarnings("deprecation")
            Intent intent = keyguard.createConfirmDeviceCredentialIntent(
                title != null ? title : "Unlock Digital Somity",
                reason != null ? reason : "Confirm your device credentials"
            );
            if (intent == null) {
                return false;
            }

            // Keep the same pending call for the activity result.
            pendingCall = call;
            startActivityForResult(call, intent, "credentialResult");
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @ActivityCallback
    private void credentialResult(PluginCall call, ActivityResult result) {
        pendingCall = null;
        activePrompt = null;
        if (result.getResultCode() == Activity.RESULT_OK) {
            call.resolve();
        } else {
            call.reject("Device credential cancelled", "userCancel");
        }
    }

    @PluginMethod
    public void openSecuritySettings(PluginCall call) {
        try {
            Intent intent;
            if (Build.VERSION.SDK_INT >= 30) {
                intent = new Intent(Settings.ACTION_BIOMETRIC_ENROLL);
            } else {
                intent = new Intent(Settings.ACTION_SECURITY_SETTINGS);
            }
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            call.resolve();
        } catch (Exception e) {
            try {
                Intent fallback = new Intent(Settings.ACTION_SETTINGS);
                fallback.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getContext().startActivity(fallback);
                call.resolve();
            } catch (Exception e2) {
                call.reject(e2.getMessage(), "settingsError");
            }
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
        activePrompt = null;
        if (call != null) {
            call.resolve();
        }
    }

    private void finishWithReject(String message, String code) {
        PluginCall call = pendingCall;
        pendingCall = null;
        activePrompt = null;
        if (call != null) {
            call.reject(message, code);
        }
    }
}
