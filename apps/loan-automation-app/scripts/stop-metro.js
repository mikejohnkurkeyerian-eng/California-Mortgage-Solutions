const { execSync } = require('child_process');
const os = require('os');

console.log('Stopping Metro bundler on port 8081...');

try {
  if (os.platform() === 'win32') {
    // Windows: Find and kill process using port 8081
    try {
      const result = execSync('netstat -ano | findstr :8081', { encoding: 'utf8' });
      const lines = result.split('\n').filter(line => line.includes('LISTENING'));
      if (lines.length > 0) {
        const pid = lines[0].trim().split(/\s+/).pop();
        if (pid) {
          console.log(`Found process ${pid} using port 8081`);
          execSync(`taskkill /F /PID ${pid}`, { stdio: 'inherit' });
          console.log('✓ Metro bundler stopped');
        }
      } else {
        console.log('No process found on port 8081');
      }
    } catch (error) {
      console.log('No Metro process running on port 8081');
    }
  } else {
    // Unix/Linux/Mac
    try {
      execSync('lsof -ti:8081 | xargs kill -9', { stdio: 'inherit' });
      console.log('✓ Metro bundler stopped');
    } catch (error) {
      console.log('No Metro process running on port 8081');
    }
  }
} catch (error) {
  console.log('Could not stop Metro (it may not be running)');
}

