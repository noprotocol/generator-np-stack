const slugify = require("slugify");

module.exports = function(generator) {
  // Define the various prompts
  const prompts = [
    {
      type: "input",
      name: "db_name",
      message: "What is your database name?",
      default: "",
      required: true,
      when() {
        if (typeof generator.options.name !== "undefined") {
          return false;
        }
        return true;
      }
    },
    {
      type: "input",
      name: "db_user",
      message: "What is your database user name?",
      default: "root",
      required: true,
      when() {
        if (typeof generator.options.name !== "undefined") {
          return false;
        }
        return true;
      }
    },
    {
      type: "password",
      name: "db_pass",
      message: "What is your database password?",
      default: "root",
      required: true,
      when() {
        if (typeof generator.options.name !== "undefined") {
          return false;
        }
        return true;
      }
    }
  ];

  return prompts;
};
