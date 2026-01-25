import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.deenly.app',
  appName: 'Deenly',
  webDir: 'out',
  /* server: {
    url: 'https://deenly-spx9.vercel.app',
    cleartext: true
  }, */
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#10B981",
      showSpinner: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#10B981'
    }
  }
};

export default config;
