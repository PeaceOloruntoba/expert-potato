const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const { join } = require("path");

// Manually resolve the directory to ensure it's a valid string for Node 24
const projectRoot = process.cwd();
const config = getDefaultConfig(projectRoot);

module.exports = withNativeWind(config, {
  input: "./src/global.css", // Ensure this path is correct for NativeWind 4
});