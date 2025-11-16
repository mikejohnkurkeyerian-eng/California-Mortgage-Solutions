// Production startup script for Railway
// This handles path resolution and starts the service

// Register tsconfig-paths before any other imports
const tsConfigPaths = require('tsconfig-paths');
const path = require('path');

// Load tsconfig and resolve paths
// When running from services/loan-service/, go up two levels to repo root
const tsConfig = require('../../tsconfig.base.json');
const baseUrl = path.resolve(__dirname, '../..');

tsConfigPaths.register({
  baseUrl: baseUrl,
  paths: tsConfig.compilerOptions.paths
});

// Now require the actual main file
require('./dist/main.js');

