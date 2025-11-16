// Register tsconfig-paths before any other imports
const tsConfigPaths = require('tsconfig-paths');
const path = require('path');

// Load tsconfig and resolve paths
const tsConfig = require('../../tsconfig.base.json');
const baseUrl = path.resolve(__dirname, '../..');

tsConfigPaths.register({
  baseUrl: baseUrl,
  paths: tsConfig.compilerOptions.paths
});

