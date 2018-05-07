var path = require('path');
var findup = require('findup');
var Promise = require('bluebird');

/**
 * @param {string} importOriginPath Path of file that made @import reference
 */
module.exports = function nearestPackageRoot(packageName, importOriginPath) {
    var pathToFind = path.join('node_modules', packageName, 'package.json');
    var dirnameOfImportOrigin = path.dirname(importOriginPath);
    var promise, handleFoundPath;

    promise = new Promise(function (resolve, reject) {
        handleFoundPath = function (err, nearestPackageParent) {
            if(err) {
                reject(err);
                return;
            }

            var packageJSONLocation = path.join( nearestPackageParent, 'node_modules', packageName);

            resolve(packageJSONLocation);
        };
    });

    findup(dirnameOfImportOrigin, pathToFind, handleFoundPath);

    return promise;
};
