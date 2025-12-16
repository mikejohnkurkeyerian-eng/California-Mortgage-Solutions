const { execSync } = require('child_process');
const os = require('os');

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (loopback) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIP = getLocalIP();
console.log('🚀 Starting Metro Bundler...');
console.log(`📱 Your computer's IP: ${localIP}`);
console.log(`🌐 Metro will be available at: http://${localIP}:8081`);
console.log('');
console.log('To connect your phone:');
console.log('1. Make sure your phone is on the same Wi-Fi network');
console.log('2. Shake your phone and select "Settings"');
console.log('3. Enter the Debug server host: ' + localIP + ':8081');
console.log('');
console.log('Or use ADB to set it automatically:');
console.log(`   adb reverse tcp:8081 tcp:8081`);
console.log('');

// Start Metro bundler
try {
  execSync('npx react-native start', {
    stdio: 'inherit',
    cwd: require('path').join(__dirname, '..')
  });
} catch (error) {
  // Metro bundler was stopped
  process.exit(0);
}

