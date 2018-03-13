const preset = require("./../templates/project/vue-preset.json");
const fs = require("fs-extra");
const path = require("path");

module.exports = function(generator) {
  generator.log("✏️  Generating Vue app");

  // Generate vue cli app based on NoProtocol preset
  generator.spawnCommandSync(
    "vue",
    [
      "create",
      "--inlinePreset",
      JSON.stringify(preset),
      "-f",
      "--no-verify",
      "_frontend"
    ],
    {
      cwd: generator.answers.name
    }
  );

  // Add the NoProtocol Vue Cli Plugin
  generator.spawnCommandSync("yarn", ["add", "noprotocol/vue-cli-plugin-np"], {
    cwd: path.resolve(generator.answers.name, "_frontend")
  });

  // Invoke the plugin to implement our tweaks
  generator.spawnCommandSync("vue", ["invoke", "np"], {
    cwd: path.resolve(generator.answers.name, "_frontend")
  });

  // Remove the by default generated .git folder and .gitignore
  fs.removeSync(path.resolve(generator.answers.name, "_frontend", ".git/"));
  fs.removeSync(
    path.resolve(generator.answers.name, "_frontend", ".gitignore")
  );
};
