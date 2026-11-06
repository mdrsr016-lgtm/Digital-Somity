import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.digitalsomity.app',
  appName: 'Digital Somity',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;

