/**
 * Deprecated
 */
const _ = require('lodash');

module.exports = function(generator) {
  // Define the possible app types
  const appTypes = [
    {
      name: 'Vue',
      value: 'vue'
    },
    {
      name: 'Laravel',
      value: 'laravel'
    },
    {
      name: 'Mix',
      value: 'mix'
    }
  ];

  // Define the various prompts
  const prompts = [
    {
      type: 'text',
      name: 'name',
      message: 'App name',
      default: generator.appname,
      required: true,
      when: function() {
        if (typeof generator.options.name !== 'undefined') {
          return false;
        }
        return true;
      }
    }
  ];

  return prompts;
};
