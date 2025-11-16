const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

// Get source extensions from default config
const sourceExts = defaultConfig.resolver?.sourceExts || ['js', 'jsx', 'json', 'ts', 'tsx'];

const config = {
  watchFolders: [
    path.resolve(__dirname, '../../libs/shared-types'),
    path.resolve(__dirname, '../../node_modules'),
  ],
  resolver: {
    // Aliases must be defined BEFORE nodeModulesPaths
    alias: {
      '@shared-types': path.resolve(__dirname, '../../libs/shared-types/src'),
      '@loan-platform/shared-types': path.resolve(__dirname, '../../libs/shared-types/src'),
    },
    sourceExts: sourceExts,
    // Ensure TypeScript files are handled
    assetExts: defaultConfig.resolver?.assetExts || [],
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, '../../node_modules'),
      // Add pnpm store paths for module resolution
      path.resolve(__dirname, '../../node_modules/.pnpm'),
    ],
    // Resolve modules with alias priority
    resolverMainFields: ['react-native', 'browser', 'main'],
    // Enable symlinks for pnpm workspace
    unstable_enableSymlinks: true,
  },
};

module.exports = mergeConfig(defaultConfig, config);

