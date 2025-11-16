import {Platform} from 'react-native';

/**
 * Get the base URL for API calls
 * - Android emulator: uses 10.0.2.2 to access localhost on the host machine
 * - Physical Android device: uses your computer's local IP address (e.g., 192.168.1.100)
 * - iOS simulator: uses localhost
 * - Physical iPhone: uses your Mac's local IP address (e.g., 192.168.1.100)
 * 
 * To find your computer's IP address:
 * Windows: ipconfig (look for IPv4 Address under your WiFi adapter)
 * Mac/Linux: ifconfig or ip addr (or System Preferences → Network on Mac)
 */
const getBaseURL = (port: number): string => {
  if (__DEV__) {
    // In development mode
    if (Platform.OS === 'android') {
      // ============================================
      // FOR ANDROID PHYSICAL DEVICE TESTING:
      // ============================================
      // Change '10.0.2.2' below to your computer's IP address
      // Find your IP: Run .\get-ip.ps1 or use: ipconfig
      // Example: '192.168.1.100'
      // 
      // 10.0.2.2 = Android emulator (works automatically)
      // Your IP = Physical device (must be on same WiFi)
      // ============================================
      const apiHost = '10.0.2.2'; // ← Change this to your IP for physical device
      
      return `http://${apiHost}:${port}`;
    } else if (Platform.OS === 'ios') {
      // ============================================
      // FOR iOS PHYSICAL DEVICE TESTING:
      // ============================================
      // Change 'localhost' below to your Mac's IP address
      // Find your Mac's IP: System Preferences → Network
      // Example: '192.168.1.100'
      // 
      // localhost = iOS Simulator (works automatically)
      // Your Mac's IP = Physical iPhone (must be on same WiFi)
      // ============================================
      const apiHost = 'localhost'; // ← Change this to your Mac's IP for physical iPhone
      
      return `http://${apiHost}:${port}`;
    } else {
      // Other platforms
      return `http://localhost:${port}`;
    }
  } else {
    // ============================================
    // PRODUCTION MODE - UPDATE THIS!
    // ============================================
    // Replace with your actual production backend URL
    // 
    // Options:
    // 1. Deploy to Railway/Render/Heroku and use their URLs
    // 2. Use ngrok for testing: https://your-ngrok-url.ngrok.io
    // 3. Use your local IP if testing on same network: http://192.168.1.100
    // 
    // Example with deployed backend:
    // return `https://loan-service-production.up.railway.app/api`;
    // 
    // Example with ngrok (testing only):
    // return `https://abc123.ngrok.io/api`;
    // 
    // Example with local IP (same network only):
    // return `http://192.168.1.100:${port}`;
    // ============================================
    
    // TODO: Replace with your production backend URL
    // For now, this will use localhost (won't work in production APK!)
    const PRODUCTION_API_BASE = 'http://localhost'; // ← CHANGE THIS!
    
    return `${PRODUCTION_API_BASE}:${port}`;
  }
};

// API endpoints
export const API_CONFIG = {
  LOAN_SERVICE: getBaseURL(4002),
  DOCUMENT_SERVICE: getBaseURL(4003),
  AUTH_SERVICE: getBaseURL(4001),
};

export default API_CONFIG;
