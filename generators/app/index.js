"use strict";

const Generator = require("yeoman-generator");
// const yosay = require("yosay");
const fs = require("fs-extra");
const path = require("path");
const prompts = require("./prompts");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    // Temporary install dirs
    this.vueInstallPath = "_frontend";
    this.laravelInstallPath = "_backend";
  }

  /**
   * Start the generator run context.
   * @see http://yeoman.io/authoring/running-context.html
   */
  initializing() {
    this.log("Initializing generator");
  }

  prompting() {
    return this.prompt(prompts(this)).then(answers => {
      this.answers = answers;
    });
  }

  configuring() {
    this.log("Configuring generator");

    fs.ensureDirSync(this.answers.name);

    // Remove previous install dirs if needed
    // this._removeInstallDir(
    //   this.destinationPath(path.resolve(this.answers.name, this.vueInstallPath))
    // );
    // this._removeInstallDir(
    //   this.destinationPath(
    //     path.resolve(this.answers.name, this.laravelInstallPath)
    //   )
    // );
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

        break;
    }
  }

  /**
   * Copy any needed files, substituting placeholders when needed
   */
  writing() {
    this.log("Writing files");

    this.fs.copy(
      this.templatePath("vue"),
      this.destinationPath(this.answers.name)
    );

    this.fs.copy(
      this.templatePath("project/_.gitignore"),
      this.destinationPath(path.resolve(this.answers.name, ".gitignore"))
    );
  }

  /**
   * Install dependencies, different files etc
   */
  install() {}

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
