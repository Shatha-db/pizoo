import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pizoo.dating',
  appName: 'Pizoo',
  webDir: 'build',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    hostname: 'pizoo.app'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#667eea',
      showSpinner: true,
      spinnerColor: '#ffffff'
    },
    Camera: {
      permissions: {
        camera: 'Camera permission is required for profile photos'
      }
    },
    Geolocation: {
      permissions: {
        location: 'Location permission is required to find nearby users'
      }
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;
