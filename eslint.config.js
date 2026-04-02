const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      ".expo/*",
      "dist/*",
      "node_modules/*",
      "__expo_template__/*"
    ]
  }
]);
