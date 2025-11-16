// Production startup script
// This file should be in the service root and will handle path resolution

// Register tsconfig-paths before any other imports
const tsConfigPaths = require('tsconfig-paths');
const path = require('path');

// Load tsconfig and resolve paths
// From the service root, go up two levels to get to repo root
const tsConfig = require('../../tsconfig.base.json');
const baseUrl = path.resolve(__dirname, '../..');

tsConfigPaths.register({
  baseUrl: baseUrl,
  paths: tsConfig.compilerOptions.paths
});

// Now require the actual main file
require('./dist/main.js');

