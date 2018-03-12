const preset = require("./../templates/project/vue-preset.json");
const fs = require("fs-extra");

module.exports = function(generator) {
  generator.log("✏️  Generating Vue app");

  // Generate vue cli app based on NoProtocol preset
  generator.spawnCommandSync("vue", [
    "create",
    "--inlinePreset",
    JSON.stringify(preset),
    "-f",
    generator.vueInstallPath
  ]);

  // Add the NoProtocol Vue Cli Plugin
  generator.spawnCommandSync("yarn", ["add", "noprotocol/vue-cli-plugin-np"], {
    cwd: "_frontend"
  });

  // Invoke the plugin to implement our tweaks
  generator.spawnCommandSync("vue", ["invoke", "np"], {
    cwd: "_frontend"
  });

  // Remove the by default generated .git folder and .gitignore
  fs.removeSync("_frontend/.git/");
  fs.removeSync("_frontend/.gitignore");
};
