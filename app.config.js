export default {
    expo: {
      name: "your-app-name",
      slug: "your-app-slug",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/icon.png",
      splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
      },
      updates: {
        fallbackToCacheTimeout: 0
      },
      assetBundlePatterns: [
        "**/*"
      ],
      ios: {
        supportsTablet: true
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/adaptive-icon.png",
          backgroundColor: "#FFFFFF"
        }
      },
      web: {
        favicon: "./assets/favicon.png"
      },
      extra: {
        apiKey: "AIzaSyAW0KwZWSYWA4qIORW3H3idl2O6H_r4DWg",
        authDomain: "mobil-31aa7.firebaseapp.com",
        projectId: "mobil-31aa7",
        storageBucket: "mobil-31aa7.firebasestorage.app",
        messagingSenderId: "100898415383",
        appId: "1:100898415383:web:cfeeea5597c57a26ad8d52",
      }
    }
  };