const fs = require("fs-extra");

module.exports = function(generator) {
  generator.log("✏️  Generating Laravel app");

  generator.spawnCommandSync("composer", [
    "create-project",
    "--prefer-dist",
    "laravel/laravel",
    generator.laravelInstallPath
  ]);

  fs.removeSync("_backend/package.json");

  fs.removeSync("_backend/.gitignore");
};
