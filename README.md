# Web Template

A starter template for static websites.

## Getting Started

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

Start developing:

```
npm install
npm start
```

Run tests once:

```
npm test
```

Run tests every time a file is changed:

```
npm run tdd
```

Build for production:

```
gulp build
```

Test the production build in the browser:

```
gulp serve:dist
```
