import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.danidev.InventarioScanner',
  appName: 'InventarioScanner',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/InventarioScanner',
      iosIsEncryption: true,
      iosKeychainPrefix: 'inventory-scanner',
      iosBiometric: {
        biometricAuth: false,
        biometricTitle : "Biometric login for capacitor sqlite"
      },
    androidIsEncryption: true,
    androidBiometric: {
      biometricAuth : false,
      biometricTitle : "Biometric login for capacitor sqlite",
        biometricSubTitle : "Log in using your biometric"
    },
    electronIsEncryption: true,
    electronWindowsLocation: "C:\\ProgramData\\InventarioScanner",
    electronMacLocation: "/Volumes/Development_Lacie/Development/InventarioScanner",
    electronLinuxLocation: ".local/share/InventarioScanner"
    }
  }
};

export default config;
