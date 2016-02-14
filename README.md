# Web Template

[![devDependency Status](https://david-dm.org/msrose/web-template/dev-status.svg)](https://david-dm.org/msrose/web-template#info=devDependencies)

A starter template for static websites.

## Getting Started

You should really use npm version 3.x or greater, since it provides a
[performance boost when using babel](https://babeljs.io/docs/setup/#gulp).
Also, avoiding infinite nesting of node_modules is just plain nice.

Clone the template:

```
git clone https://github.com/msrose/web-template.git my-website
cd my-website
```

You'll want to create a new repository:

```
rm -rf .git
rm README.md
git init .
git add .
git commit -m "Initial commit"
```

Start developing: `npm install && gulp`

Run tests once: `npm test`

Run tests every time a file is changed: `npm run tdd`

Build for production: `gulp build`

Test the production build in the browser: `gulp serve:dist`
