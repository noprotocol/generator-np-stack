module.exports = function(generator) {
  generator.log("✏️ Generating Laravel app");

  generator.spawnCommandSync("composer", [
    "create-project",
    "--prefer-dist",
    "laravel/laravel",
    generator.laravelInstallPath
  ]);
};
