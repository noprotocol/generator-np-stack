const fs = require("fs-extra");

module.exports = function(generator) {
  generator.log("✏️  Generating Laravel app");

  // Install Laravel through composer
  generator.spawnCommandSync("composer", [
    "create-project",
    "--prefer-dist",
    "laravel/laravel",
    generator.laravelInstallPath
  ]);

  // Remove the generated package.json
  fs.removeSync("_backend/package.json");

  // Remove the generated .gitignore file
  fs.removeSync("_backend/.gitignore");
};
