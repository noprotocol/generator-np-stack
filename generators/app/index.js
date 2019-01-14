"use strict";

const Generator = require("yeoman-generator");
const fs = require("fs-extra");
const path = require("path");
const replace = require("replace-in-file");

const prompts = require("./prompts");

module.exports = class extends Generator {
  /**
   * Start the generator run context.
   * @see http://yeoman.io/authoring/running-context.html
   */
  initializing() {
    this.log("     _  __     ___           __                __");
    this.log("    / |/ /__  / _ \\_______  / /____  _______  / /");
    this.log("   /    / _ \\/ ___/ __/ _ \\/ __/ _ \\/ __/ _ \\/ / ");
    this.log("  /_/|_/\\___/_/  /_/  \\___/\\__/\\___/\\__/\\___/_/");
    this.log("");
  }

  prompting() {
    return this.prompt(prompts(this)).then(answers => {
      this.answers = answers;
    });
  }

  configuring() {
    this.log("Configuring Generator");

    // TODO: Check if target dir already exists
  }

  /**
   * Set the queue order within the 'default'.
   *
   * We need to run the Vue and Laravel installers in this queue, as it is run before the write() queue.
   * This way, we can install them and replace all the config files afterwards.
   */
  default() {
    switch (this.answers.stack) {
      case "laravue":
        this.spawnCommandSync("composer", [
          "create-project",
          "--prefer-dist",
          "laravel/laravel",
          this.answers.name
        ]);

        // Remove Laravel's webpack.
        fs.removeSync(path.resolve(this.answers.name, "webpack.mix.js"));

        // Remove Laravel's assets folders.
        fs.removeSync(path.resolve(this.answers.name, "resources/assets"));

        // Remove Laravel's default view
        fs.removeSync(
          path.resolve(this.answers.name, "resources/views/welcome.blade.php")
        );

        // Remove Laravel's default readme.
        fs.removeSync(path.resolve(this.answers.name, "readme.md"));

        // Remove the generated package.json
        fs.removeSync(path.resolve(this.answers.name, "package.json"));

        fs.removeSync(path.resolve(this.answers.name, "routes/web.php"));
        fs.removeSync(path.resolve(this.answers.name, ".editorconfig"));

        // Remove the generated .gitignore file
        fs.removeSync(path.resolve(this.answers.name, ".gitignore"));

        // Chmod for apache users (don't want to include the recursive version)
        [
          "bootstrap/cache",
          "storage",
          "storage/app",
          "storage/app/public",
          "storage/logs",
          "storage/framework",
          "storage/framework/cache",
          "storage/framework/sessions",
          "storage/framework/testing",
          "storage/framework/views"
        ].forEach(folder => {
          fs.chmodSync(path.resolve(this.answers.name, folder), 0o777);
        });
        break;
      case "vue":
        break;
    }
  }

  /**
   * Copy any needed files, substituting placeholders when needed
   */
  writing() {
    this.log("Writing files");

    // Copy the frontend folder into the target
    this.fs.copy(
      this.templatePath("vue"),
      this.destinationPath(this.answers.name)
    );
    this.fs.copy(
      this.templatePath("vue/tests/e2e/.eslintrc"),
      this.destinationPath(this.answers.name, "tests/e2e/.eslintrc")
    );

    // Copy the gitignore into the target
    this.fs.copy(
      this.templatePath("project/_.gitignore"),
      this.destinationPath(path.resolve(this.answers.name, ".gitignore"))
    );

    if (this.answers.stack === "laravue") {
      // Copy the WebsiteController.php
      this.fs.copy(
        this.templatePath(
          "laravel/app/Http/Controllers/_WebsiteController.php"
        ),
        this.destinationPath(
          path.resolve(
            this.answers.name,
            "app/Http/Controllers/WebsiteController.php"
          )
        )
      );

      // Overwrite Laravel's web.php routes with the generator's web.php
      this.fs.copy(
        this.templatePath("laravel/routes/_web.php"),
        this.destinationPath(path.resolve(this.answers.name, "routes/web.php"))
      );

      // Update Laravel's .env and .env.example setting
      replace.sync({
        files: [
          path.resolve(this.answers.name, ".env"),
          path.resolve(this.answers.name, ".env.example")
        ],
        from: [/APP_NAME=Laravel/g, /LOG_CHANNEL=stack/g],
        to: [`APP_NAME="${this.answers.name}"`, "LOG_CHANNEL=daily"]
      });
    }

    this.fs.copyTpl(
      this.templatePath("project/_readme.md"),
      this.destinationPath(path.resolve(this.answers.name, "Readme.md")),
      {
        PROJECT_NAME: this.answers.name
      }
    );
  }

  /**
   * Install dependencies, different files etc
   */
  install() {
    this.yarnInstall([], {
      cwd: this.answers.name
    });
  }

  /**
   * Last function the yeoman context run
   * Write/edit files here *composer.json, package.json etc)
   */
  end() {
    // Create a fresh repository
    this.spawnCommandSync("git", ["init"], {
      cwd: this.answers.name
    });

    // Add everything
    this.spawnCommandSync("git", ["add", "."], {
      cwd: this.answers.name
    });

    // Commit it
    this.spawnCommandSync("git", ["commit", "-m", "init"], {
      cwd: this.answers.name
    });

    this.log("\n✨ Setup is now finished. Enjoy developing! ://\n");
  }

  /**
   * DEPRECATED
   * Delete previous temp install dirs for Laravel and Vue
   */
  _removeInstallDir(path) {
    fs.pathExists(path, (err, exists) => {
      if (exists) {
        this.log(`Removing (previous) installation folder ${path}`);
        fs.remove(this.destinationPath(path));
      }
    });
  }
};
