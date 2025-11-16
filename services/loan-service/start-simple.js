// Simple startup script - handles path resolution
// This file should be in services/loan-service/

const tsConfigPaths = require('tsconfig-paths');
const path = require('path');

// Get the repo root (two levels up from services/loan-service/)
const repoRoot = path.resolve(__dirname, '../..');
const tsConfig = require(path.join(repoRoot, 'tsconfig.base.json'));

tsConfigPaths.register({
  baseUrl: repoRoot,
  paths: tsConfig.compilerOptions.paths
});

// Now require the main file
require('./dist/main.js');

