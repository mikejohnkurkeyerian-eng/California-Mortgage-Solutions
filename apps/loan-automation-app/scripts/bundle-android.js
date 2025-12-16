const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Ensure assets directory exists
const assetsDir = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
  console.log('✓ Created assets directory');
}

console.log('Bundling React Native JavaScript for Android...');

try {
  execSync(
    'npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res',
    {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    }
  );
  console.log('✓ Bundle created successfully!');
} catch (error) {
  console.error('✗ Failed to create bundle:', error.message);
  process.exit(1);
}

