var path = require('path');
var nearestPackageRoot = require('./nearest-package-root');

module.exports = Package;

function Package(rootPath) {
    this.root = path.join.bind(null, rootPath);
    this.JSON = require(this.root('package.json'));
};

Package.prototype.fullPathToEntrypoint = function fullPathToEntrypoint() {
    return this.root(this.entrypoint());
};

Package.prototype.entrypoint = function entrypoint() {
    if (this.JSON.sass) {
        return this.JSON.sass;
    // look for "style" declaration in package.json
    } else if (this.JSON.style) {
        return this.JSON.style;
    // look for a css/sass/scss file in the "main" declaration in package.json
    } else if (/\.(sa|c|sc)ss$/.test(this.JSON.main)) {
        return this.JSON.main;
    // otherwise assume ./styles.scss
    } else {
        return 'styles';
    }
};
