var path = require('path');
var nearestPackageRoot = require('./nearest-package-root');

module.exports = Import;

function Import(importUrl) {
    this.importUrl = importUrl;
}

Import.prototype.isScoped = function isScoped() {
    return this.importUrl[0] === '@';
};

Import.prototype.packageName = function packageName() {
    if (this.isScoped()) {
        return this.importUrl.split(path.sep, 2).join(path.sep);
    } else {
        return this.importUrl.split(path.sep, 1)[0];
    }
};

Import.prototype.isEntrypoint = function isEntrypoint() {
    var safePathSplitPattern = new RegExp(path.sep + '.');
    var pathSegmentCount = this.importUrl.split(safePathSplitPattern).length;

    if (this.isScoped()) {
        return pathSegmentCount === 2;
    } else {
        return pathSegmentCount === 1;
    }
};

Import.prototype.specifiedFilePath = function specifiedFilePath() {
    return this.importUrl.slice(this.packageName().length);
};
