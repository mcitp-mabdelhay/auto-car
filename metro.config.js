const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.minifierConfig = {
  ...config.transformer.minifierConfig,
  output: {
    ...config.transformer.minifierConfig?.output,
    comments: false,
  },
};

module.exports = config;
