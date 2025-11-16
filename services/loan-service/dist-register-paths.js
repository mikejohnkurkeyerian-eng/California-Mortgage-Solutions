// Register tsconfig-paths before any other imports
// This version is for dist/ folder - paths are adjusted
const tsConfigPaths = require('tsconfig-paths');
const path = require('path');

// Load tsconfig and resolve paths
// From dist/, go up to service root, then up two more to repo root
const tsConfig = require('../../../tsconfig.base.json');
const baseUrl = path.resolve(__dirname, '../../..');

tsConfigPaths.register({
  baseUrl: baseUrl,
  paths: tsConfig.compilerOptions.paths
});

