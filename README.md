# generator-np-stack

>

## Usage

First, install [Yeoman](http://yeoman.io) and generator-np-stack (we assume you have pre-installed [node.js](https://nodejs.org/)):

```bash
npm install -g yo
npm install -g noprotocol/generator-np-stack
```

Then generate your new project:

```bash
yo np-stack
```

Give your project a sensible name, and choose your desired Stack.

## Contributing to the generator

If you want to contribute to the generator the best thing to do is to follow these steps:

```bash
npm uninstall -g generator-np-stack
git clone git@github.com:noprotocol/generator-np-stack.git
cd generator-np-stack
npm link
```

This way you can work locally on the generator, and test your changes by running the `yo` command as usual.
