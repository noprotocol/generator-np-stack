"use strict";

const Generator = require("yeoman-generator");

const prompts = require("./prompts");

const fs = require("fs-extra");
const path = require("path");
const replace = require("replace-in-file");

const crypto = require("crypto");

function randomValueHex(length) {
  return crypto
    .randomBytes(Math.ceil((length * 3) / 4))
    .toString("base64") // convert to base64 format (could use 'hex')
    .slice(0, length) // return required number of characters
    .replace(/\+/g, "0") // replace '+' with '0'
    .replace(/\//g, "0"); // replace '/' with '0'
}

module.exports = class extends Generator {
  initializing() {
    this.log("Initializing the Wordpress sub-generator");
    this.log("This generator will install Wordpress into a folder `cms`");
    this.log("");
  }

  prompting() {
    return this.prompt(prompts(this)).then(answers => {
      this.answers = answers;
    });
  }

  configuring() {
    this.log("Configuring Generator");

    this.wpAdminPassword = randomValueHex(12);
  }

  default() {
    // Install WP Core
    this.spawnCommandSync("wp", [
      "core",
      "download",
      "--skip-content",
      "--path=cms"
    ]);
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath("cms/_wp-config.php"),
      this.destinationPath(path.resolve("cms", "wp-config.php"))
    );

    this.fs.copyTpl(
      this.templatePath("cms/_wp-salt.php"),
      this.destinationPath(path.resolve("cms", "wp-salt.php")),
      {
        AUTH_KEY: randomValueHex(64),
        SECURE_AUTH_KEY: randomValueHex(64),
        LOGGED_IN_KEY: randomValueHex(64),
        NONCE_KEY: randomValueHex(64),
        AUTH_SALT: randomValueHex(64),
        SECURE_AUTH_SALT: randomValueHex(64),
        LOGGED_IN_SALT: randomValueHex(64),
        NONCE_SALT: randomValueHex(64)
      }
    );

    this.fs.copyTpl(
      this.templatePath("cms/_.env"),
      this.destinationPath(path.resolve("cms", ".env")),
      {
        APP_URL: this.answers.app_url,
        DB_DATABASE: this.answers.db_name,
        DB_USERNAME: this.answers.db_user,
        DB_PASSWORD: this.answers.db_pass,
        ACF_PRO_KEY:
          "b3JkZXJfaWQ9MTIwMTc0fHR5cGU9ZGV2ZWxvcGVyfGRhdGU9MjAxNy0xMi0wNSAwOTozMDo0NQ==",
        ADMIN_PASS: this.wpAdminPassword
      }
    );

    this.fs.copyTpl(
      this.templatePath("cms/_composer.json"),
      this.destinationPath(path.resolve("cms", "composer.json"))
    );
  }

  install() {
    this.spawnCommandSync("composer", ["install"], {
      cwd: "cms"
    });

    // Install WP
    this.spawnCommandSync("wp", [
      "core",
      "install",
      "--url=http://localhost:8000",
      "--path=cms",
      "--title=NP Consol",
      "--admin_email=info@noprotocol.nl",
      "--admin_user=admin'",
      "--admin_password=" + this.wpAdminPassword
      //   "--skip-email"
    ]);

    this.fs.copyTpl(
      this.templatePath("cms/consol"),
      this.destinationPath(
        path.resolve("cms", "wp-content", "themes", "consol")
      )
    );

    this.spawnCommandSync(
      "wp",
      ["plugin", "activate", "advanced-custom-fields-pro"],
      { cwd: "cms" }
    );

    [
      "svg-support",
      "wp-smushit",
      "wordpress-seo",
      "acf-to-rest-api",
      "acf-to-wp-api"
    ].forEach(plugin => {
      this.spawnCommandSync("wp", ["plugin", "install", plugin, "--activate"], {
        cwd: "cms"
      });
    });
  }

  end() {
    this.spawnCommandSync("wp", ["theme", "activate", "consol"], {
      cwd: "cms"
    });

    this.log(
      "\n✨ You can log in to WP with admin / " + this.wpAdminPassword + "\n"
    );
  }
};
