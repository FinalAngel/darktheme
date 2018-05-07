# npm sass

Import installed node modules in sass with no extra configuration.

Because of the way npm installs modules in a nested tree structure, there is no reliable way to ensure the location of locally installed dependencies. In particular - modules are not necessarily installed into ./node_modules. This causes trouble when trying to use npm dependencies in sass files where `--includePath ./node_modules` can fail unexpectedly if a dependency is shared with an ancestor (and so installed further up the tree).

This module will automatically allow access to all locally installed npm modules, irrespective of their install location.

## Install

```
npm install npm-sass
```

## Usage

From the command line:

```
npm-sass ./assets/styles/app.scss > ./public/css/output.css
```

Programmatically:

```javascript
require('npm-sass')('./assets/sass/app.scss', function (err, result) {
    ...
});
```

In gulp:

```javascript
var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {
  gulp.src(['./src/*.scss'])
    .pipe(sass({
      importer: require('npm-sass').importer
    }))
    .pipe(gulp.dest('./src/generated/css'));
});
```

## Imports

Imports on npm modules are defined in the usual way in your sass files.

The order in which the importer tries to resolve a package's sass file location is as follows:

 - Path defined in the `"sass"` property in the module's package.json
 - Path defined in the `"style"` property in the module's package.json
 - Path defined in the `"main"` property in the module's package.json if the file ends in .sass, .scss, or .css
 - `./styles.scss`

Example:

```sass
@import "bootstrap";
```

This will import `./node_modules/bootstrap/dist/css/bootstrap.css` since this is [defined in bootstrap's package.json's `"style"` property](https://github.com/twbs/bootstrap/blob/master/package.json#L21)

If no `"style"` declaration exists in the package.json of the imported module, then sass will attempt to load `./styles.scss` from the root of the module.

Alternatively, a specific file can be specified from the module.

Example:

```sass
@import "font-awesome/scss/font-awesome";
```

## Options

An additional `options` parameter can be passed to the npm-sass function to define options that are passed through to [node-sass](http://npmjs.com/package/node-sass).


```javascript
require('npm-sass')('./assets/sass/app.scss', { indentWidth: 4 }, function (err, result) {
    ...
});
```

## Aliases

When using npm-sass programmatically you can also define an alias mapping which will can map particular import paths to other values. This is useful for cases where the exact files to import might be derived from configuration.

For example, the code below will convert `@import "$$theme"` to `$import "my-theme"` before resolving.

```javascript
const options = {
  theme: 'my-theme'
};
const aliases = {
  '$$theme': options.theme
};
require('npm-sass')('./assets/sass/app.scss', { aliases }, function (err, result) {
    ...
});
```

## Testing

A number of (very basic) test cases are defined in [./test/test-cases](./test/test-cases). Any help that can be provided in buidling up test coverage would be much appreciated.

Within each test case, a simple test is applied that the `index.scss` file in each case will successfully compile to valid css. Then any additional tests can be run for that test case, as defined in a test.js file in the test case directory.

