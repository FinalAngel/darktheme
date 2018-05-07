var sass = require('node-sass');

var importer = require('./importer');

var npmsass = function (src, options, callback) {

    var opts;

    if (arguments.length === 2 && typeof options === 'function') {
        callback = options;
        options = {};
    }

    opts = Object.assign({
        file: src,
        importer: importer(options)
    }, options);

    sass.render(opts, callback);

};

npmsass.importer = importer();

module.exports = npmsass;
