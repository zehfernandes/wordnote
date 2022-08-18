const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.transformer.minifierConfig.compress.drop_console = true;
config.resolver.assetExts.push("db");

module.exports = {
  ...config,
  transformer: {
    assetPlugins: ["expo-asset/tools/hashAssetFiles"],
  },
};
