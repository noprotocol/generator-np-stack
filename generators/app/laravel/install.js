const fs = require("fs-extra");
const path = require("path");

module.exports = function(generator) {
  generator.log("✏️  Generating Laravel app");

  // Install Laravel through composer
  generator.spawnCommandSync("composer", [
    "create-project",
    "--prefer-dist",
    "laravel/laravel",
    path.resolve(generator.answers.name, generator.laravelInstallPath)
  ]);

  // Remove the generated package.json
  fs.removeSync(
    path.resolve(
      generator.answers.name,
      generator.laravelInstallPath,
      "package.json"
    )
  );

  // Remove the generated .gitignore file
  fs.removeSync(
    path.resolve(
      generator.answers.name,
      generator.laravelInstallPath,
      ".gitignore"
    )
  );
};
