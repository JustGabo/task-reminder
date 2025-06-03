const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.extraNodeModules = {
  events: require.resolve('events/'),
  http: require.resolve('stream-http'),
  https: require.resolve('https-browserify'),
  net: require.resolve('node-libs-browser/mock/net'),
  url: require.resolve('url/'),
  stream: require.resolve('stream-browserify'),
  crypto: require.resolve('crypto-browserify'),
  tls: require.resolve('node-libs-browser/mock/tls'),
  zlib: require.resolve('browserify-zlib'),
  fs: require.resolve('node-libs-browser/mock/empty'),
  path: require.resolve('path-browserify'),
  os: require.resolve('os-browserify/browser'),
};

module.exports = defaultConfig; 