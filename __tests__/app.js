const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");

describe("generator-np-dev-stack with all arguments", () => {
  beforeAll(async () => {
    await helpers
      .run(path.join(__dirname, "../generators/app"))
      .withPrompts({ name: "testproject", stack: "vue" });
  });
  test("creates files", async () => {
    assert.file(["testproject/Readme.md", "testproject/.gitignore"]);
  });
});
