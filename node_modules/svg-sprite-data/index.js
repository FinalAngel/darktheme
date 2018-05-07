var sprite = require("./lib/svg-sprite");

/**
 * @param config
 * @returns {SpriteData}
 * @constructor
 */
function SpriteData(config) {
    this.tasks = {};
    this.counter = 0;
    this.svgs = sprite.createSprite(config);
    return this;
}

/**
 * Main Export
 * @param config
 */
module.exports = SpriteData;

/**
 * @param path
 * @param contents
 */
SpriteData.prototype.add = function (path, contents) {

    if (this.svgs) {
        this.svgs.addFile(path, contents, this.counter, this.tasks);
        this.counter = this.counter += 1;
    }

    return this;
};

/**
 * @param {Function} cb
 * @param config
 */
SpriteData.prototype.compile = function (config, cb) {

    if(typeof config === 'function' && !cb) {
      cb = config;
      config = {};
    }

    this.svgs._processFiles(this.tasks, config, function () {

        var svg = this.svgs.toSVG(false);
        var data = this.svgs.data;

        cb(null, {
            svg: svg,
            data: data
        });

        this.svgs._reset();

    }.bind(this));
};
