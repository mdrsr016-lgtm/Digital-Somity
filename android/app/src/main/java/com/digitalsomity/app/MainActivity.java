package com.digitalsomity.app;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(AppUpdaterPlugin.class);
        super.onCreate(savedInstanceState);
        lockWebViewFontScale();
    }

    @Override
    public void onStart() {
        super.onStart();
        lockWebViewFontScale();
    }

    @Override
    public void onResume() {
        super.onResume();
        // Re-apply if the user changed system font/display size while backgrounded.
        lockWebViewFontScale();
    }

    /**
     * Android accessibility / display font size multiplies WebView typography and
     * overflows fixed card layouts. Keep the app at 100% text zoom on every device.
     */
    private void lockWebViewFontScale() {
        Bridge bridge = getBridge();
        if (bridge == null) return;
        WebView webView = bridge.getWebView();
        if (webView == null) return;

        webView.post(() -> {
            try {
                WebSettings settings = webView.getSettings();
                settings.setTextZoom(100);
            } catch (Exception ignored) {
                // Bridge may not be ready yet on some OEM WebViews.
            }
        });
    }
}
