const preset = require("./../templates/project/vue-preset.json");

module.exports = function(generator) {
  generator.log("✏️  Generating Vue app");

  generator.spawnCommandSync("vue", [
    "create",
    "--inlinePreset",
    JSON.stringify(preset),
    "-f",
    generator.vueInstallPath
  ]);
};
