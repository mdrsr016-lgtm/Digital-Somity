import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.digitalsomity.app',
  appName: 'Digital Somity',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // The installed app loads this page. Pushing the site updates the app
    // without another APK install.
    url: 'https://mdrsr016-lgtm.github.io/Digital-Somity/',
    allowNavigation: [
      'mdrsr016-lgtm.github.io',
      'raw.githubusercontent.com',
    ],
  },
};

export default config;

