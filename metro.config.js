const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const { transformer, resolver } = config;

config.transformer.minifierConfig.compress.drop_console = true;
config.resolver.assetExts.push("db");

config.transformer = {
...transformer,
assetPlugins: ["expo-asset/tools/hashAssetFiles"],
}

config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
  };

module.exports = config;