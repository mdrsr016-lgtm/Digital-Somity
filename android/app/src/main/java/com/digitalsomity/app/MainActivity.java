package com.digitalsomity.app;

import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.webkit.CookieManager;
import android.widget.Toast;
import androidx.core.content.FileProvider;
import com.getcapacitor.BridgeActivity;
import java.io.File;

public class MainActivity extends BridgeActivity {
    private BroadcastReceiver downloadReceiver;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        try {
            getBridge().getWebView().setDownloadListener((url, userAgent, contentDisposition, mimetype, contentLength) -> {
                if (url != null && (url.endsWith(".apk") || url.contains(".apk?") || (mimetype != null && mimetype.contains("vnd.android.package-archive")))) {
                    try {
                        DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
                        request.setMimeType("application/vnd.android.package-archive");
                        String cookies = CookieManager.getInstance().getCookie(url);
                        if (cookies != null) request.addRequestHeader("cookie", cookies);
                        if (userAgent != null) request.addRequestHeader("User-Agent", userAgent);
                        request.setDescription("Downloading Digital Somity update...");
                        request.setTitle("digitalsomity.apk");
                        request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
                        request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, "digitalsomity.apk");

                        DownloadManager dm = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);
                        long downloadId = dm.enqueue(request);

                        Toast.makeText(getApplicationContext(), "Downloading update... check notification bar", Toast.LENGTH_LONG).show();

                        downloadReceiver = new BroadcastReceiver() {
                            @Override
                            public void onReceive(Context context, Intent intent) {
                                long id = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1);
                                if (id == downloadId) {
                                    try {
                                        File file = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), "digitalsomity.apk");
                                        if (file.exists()) {
                                            Intent installIntent = new Intent(Intent.ACTION_VIEW);
                                            Uri apkUri = FileProvider.getUriForFile(context, getPackageName() + ".fileprovider", file);
                                            installIntent.setDataAndType(apkUri, "application/vnd.android.package-archive");
                                            installIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                                            installIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                            context.startActivity(installIntent);
                                        }
                                    } catch (Exception e) {
                                        Toast.makeText(context, "Tap downloaded APK in notification bar to install", Toast.LENGTH_LONG).show();
                                    }
                                }
                            }
                        };

                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                            registerReceiver(downloadReceiver, new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE), Context.RECEIVER_NOT_EXPORTED);
                        } else {
                            registerReceiver(downloadReceiver, new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE));
                        }
                    } catch (Exception e) {
                        Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        startActivity(browserIntent);
                    }
                } else {
                    Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(browserIntent);
                }
            });
        } catch (Exception ignored) {}
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (downloadReceiver != null) {
            try {
                unregisterReceiver(downloadReceiver);
            } catch (Exception ignored) {}
        }
    }
}
