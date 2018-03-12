"use strict";

const Generator = require("yeoman-generator");
// const yosay = require("yosay");
const vueInstall = require("./vue/install");
const laravelInstall = require("./laravel/install");
const fs = require("fs-extra");
const prompts = require("./prompts");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument("name", {
      type: String,
      required: false,
      desc: "Your app name"
    });

    this.option("laravel", {
      desc: "Install Laravel",
      type: Boolean,
      default: false,
      alias: "L"
    });

    // Temporary install dirs
    this.vueInstallPath = "_vue-install";
    this.laravelInstallPath = "_backend";
  }

  /**
   * Start the generator run context.
   * @see http://yeoman.io/authoring/running-context.html
   */
  initializing() {
    this.log("Initializing generator");

    // Remove previous install dirs if needed
    // this._removeInstallDir(this.destinationPath(this.vueInstallPath));
    // this._removeInstallDir(this.destinationPath(this.laravelInstallPath));
  }

  prompting() {
    return this.prompt(prompts(this)).then(answers => {
      this.answers = answers;
    });
  }

  configuring() {
    this.log("Configuring generator");
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
        // this._handleVueInstall();
        laravelInstall(this);
        break;
    }
    // this._handleVueInstall();
    // this._handleLaravelInstall();
  }

  /**
   * Copy any needed files, substituting placeholders when needed
   */
  writing() {
    this.log("Writing files");
    // this.fs.copyTpl(
    //   this.templatePath('project/_README.MD'),
    //   this.destinationPath('README.MD'),
    //   { APPNAME: this.options.name }
    // );
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
