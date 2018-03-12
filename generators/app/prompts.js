const slugify = require("slugify");
// const _ = require("lodash");

module.exports = function(generator) {
  // Define the possible app types
  const appTypes = [
    {
      name: "Vue Only",
      value: "vue"
    },
    {
      name: "Laravel + Vue",
      value: "laravue"
    }
  ];

  // Define the various prompts
  const prompts = [
    {
      type: "text",
      name: "name",
      message: "App name",
      default: generator.appname,
      required: true,
      when: function() {
        if (typeof generator.options.name !== "undefined") {
          return false;
        }
        return true;
      },
      filter: function(input) {
        return slugify(input, {
          replacement: "_",
          remove: /[$*_+~.()'"!\-:@]/g,
          lower: true
        });
      }
    },
    {
      type: "list",
      name: "stack",
      message: "What Stack would you like to use?",
      choices: appTypes,
      default: generator.appname,
      required: true,
      when: function() {
        if (typeof generator.options.name !== "undefined") {
          return false;
        }
        return true;
      }
    }
  ];

  return prompts;
};
