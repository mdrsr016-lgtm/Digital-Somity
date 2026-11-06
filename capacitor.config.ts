import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.digitalsomity.app',
  appName: 'Digital Somity',
  webDir: 'dist',
  server: {
    // Live GitHub Pages URL: powers automatic over-the-air updates without reinstalling APK
    url: 'https://mdrsr016-lgtm.github.io/Digital-Somity/',
    androidScheme: 'https',
    cleartext: false,
  },
};

export default config;

