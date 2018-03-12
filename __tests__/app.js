'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-np-dev-stack with all arguments', () => {
  beforeAll(() => {

    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .withPrompts({ name: 'noprotocol app', type: 'vue' });
  });

  it('creates files', () => {
    assert.file(['README.MD', '.gitignore']);
  });
});
