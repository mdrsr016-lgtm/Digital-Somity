import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.digitalsomity.app',
  appName: 'Digital Somity',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // The installed app loads this page. Pushing the site updates the app
    // without another APK install.
    url: 'https://cdn.jsdelivr.net/gh/mdrsr016-lgtm/Digital-Somity@gh-pages/index.html',
    allowNavigation: [
      'cdn.jsdelivr.net',
      'raw.githubusercontent.com',
      'mdrsr016-lgtm.github.io',
    ],
  },
};

export default config;

