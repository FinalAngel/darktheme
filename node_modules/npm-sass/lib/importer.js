var local = require('./local');
var resolve = require('./resolver');

module.exports = function (options) {

    options = options || {};

    function importer(url, file, done) {
        if (options.aliases && options.aliases[url]) {
            url = options.aliases[url];
        }
        local(url, file, function (err, isLocal) {
            if (err || isLocal) {
                done({ file: url });
            } else {
                resolve(url, file)
                .catch(function () { return url; })
                .then(function (path) {
                    path = path.replace(/\.css$/, '');
                    return { file: path };
                })
                .then(done);
            }
        });
    }

    return importer;

};
