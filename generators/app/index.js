"use strict";

const Generator = require("yeoman-generator");

const fs = require("fs-extra");
const path = require("path");

const prompts = require("./prompts");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

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

        // Remove the generated package.json
        fs.removeSync(path.resolve(this.answers.name, "package.json"));

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

    // Copy the gitignore into the target
    this.fs.copy(
      this.templatePath("project/_.gitignore"),
      this.destinationPath(path.resolve(this.answers.name, ".gitignore"))
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

    this.log("Setup is now finished. Enjoy developing! ://");
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
