var Package = require('./resolver/package');
var Import = require('./resolver/import');
var nearestPackageRoot = require('./resolver/nearest-package-root');

module.exports = function resolve(importUrl, importOriginPath) {
    var _import = new Import(importUrl);

    return nearestPackageRoot(_import.packageName(), importOriginPath).then(function (packageRoot) {
        var _package = new Package(packageRoot);

        if (_import.isEntrypoint()) {
            return _package.fullPathToEntrypoint();
        } else {
            return _package.root(_import.specifiedFilePath());
        }
    });
}
