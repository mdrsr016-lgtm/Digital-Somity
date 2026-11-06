package com.digitalsomity.app;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import androidx.core.content.FileProvider;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

@CapacitorPlugin(name = "AppUpdater")
public class AppUpdaterPlugin extends Plugin {

    private static final String APK_FILE_NAME = "digitalsomity_update.apk";

    private HttpURLConnection openConnectionWithRedirects(String urlStr) throws Exception {
        URL url = new URL(urlStr);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setInstanceFollowRedirects(true);
        conn.setConnectTimeout(20000);
        conn.setReadTimeout(60000);
        conn.setRequestProperty("User-Agent", "Mozilla/5.0 DigitalSomity-AppUpdater");

        int status = conn.getResponseCode();
        if (status == HttpURLConnection.HTTP_MOVED_TEMP 
            || status == HttpURLConnection.HTTP_MOVED_PERM 
            || status == 307 
            || status == 308) {
            String newUrl = conn.getHeaderField("Location");
            conn.disconnect();
            if (newUrl != null && !newUrl.isEmpty()) {
                return openConnectionWithRedirects(newUrl);
            }
        }
        return conn;
    }

    @PluginMethod
    public void isUpdateReady(PluginCall call) {
        try {
            File apkFile = new File(getContext().getCacheDir(), APK_FILE_NAME);
            boolean ready = apkFile.exists() && apkFile.length() > 50000;
            JSObject ret = new JSObject();
            ret.put("ready", ready);
            ret.put("size", apkFile.exists() ? apkFile.length() : 0);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Failed to check update status: " + e.getMessage());
        }
    }

    @PluginMethod
    public void downloadUpdate(PluginCall call) {
        String urlString = call.getString("url");
        if (urlString == null || urlString.isEmpty()) {
            call.reject("URL is required");
            return;
        }

        // Run background download
        new Thread(() -> {
            File tempFile = new File(getContext().getCacheDir(), APK_FILE_NAME + ".tmp");
            File targetFile = new File(getContext().getCacheDir(), APK_FILE_NAME);

            HttpURLConnection connection = null;
            InputStream inputStream = null;
            FileOutputStream outputStream = null;

            try {
                if (tempFile.exists()) tempFile.delete();

                connection = openConnectionWithRedirects(urlString);
                if (connection.getResponseCode() != HttpURLConnection.HTTP_OK) {
                    call.reject("HTTP Server returned: " + connection.getResponseCode() + " " + connection.getResponseMessage());
                    return;
                }

                inputStream = connection.getInputStream();
                outputStream = new FileOutputStream(tempFile);

                byte[] buffer = new byte[8192];
                int bytesRead;
                long totalBytes = 0;

                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                    totalBytes += bytesRead;
                }

                outputStream.flush();
                outputStream.close();
                outputStream = null;

                inputStream.close();
                inputStream = null;

                if (totalBytes < 50000) {
                    tempFile.delete();
                    call.reject("Downloaded APK is too small or corrupt: " + totalBytes + " bytes");
                    return;
                }

                if (targetFile.exists()) targetFile.delete();
                boolean renamed = tempFile.renameTo(targetFile);
                if (!renamed) {
                    // Fallback copy if rename fails
                    targetFile.delete();
                    tempFile.renameTo(targetFile);
                }

                JSObject ret = new JSObject();
                ret.put("success", true);
                ret.put("bytesDownloaded", totalBytes);
                call.resolve(ret);

            } catch (Exception e) {
                if (tempFile.exists()) tempFile.delete();
                call.reject("Download failed: " + e.getMessage());
            } finally {
                try {
                    if (inputStream != null) inputStream.close();
                    if (outputStream != null) outputStream.close();
                    if (connection != null) connection.disconnect();
                } catch (Exception ignored) {}
            }
        }).start();
    }

    @PluginMethod
    public void installUpdate(PluginCall call) {
        try {
            File apkFile = new File(getContext().getCacheDir(), APK_FILE_NAME);
            if (!apkFile.exists() || apkFile.length() < 50000) {
                call.reject("No valid APK update file downloaded yet");
                return;
            }

            Context context = getContext();

            // Android 8+ Check permission for install from unknown sources
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                if (!context.getPackageManager().canRequestPackageInstalls()) {
                    Intent settingsIntent = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES);
                    settingsIntent.setData(Uri.parse("package:" + context.getPackageName()));
                    settingsIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    context.startActivity(settingsIntent);
                    
                    JSObject ret = new JSObject();
                    ret.put("success", false);
                    ret.put("needPermission", true);
                    call.resolve(ret);
                    return;
                }
            }

            Uri apkUri = FileProvider.getUriForFile(
                context,
                context.getPackageName() + ".fileprovider",
                apkFile
            );

            Intent installIntent = new Intent(Intent.ACTION_VIEW);
            installIntent.setDataAndType(apkUri, "application/vnd.android.package-archive");
            installIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            installIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            context.startActivity(installIntent);

            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Install launch failed: " + e.getMessage());
        }
    }
}
