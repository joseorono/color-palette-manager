const { spawn } = require('child_process');
const { app } = require('electron');

// Set development environment
process.env.NODE_ENV = 'development';

// Start the Electron app
const electronProcess = spawn('electron', ['.'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' }
});

electronProcess.on('close', (code) => {
  console.log(`Electron process exited with code ${code}`);
  process.exit(code);
});

electronProcess.on('error', (err) => {
  console.error('Failed to start Electron:', err);
  process.exit(1);
});
