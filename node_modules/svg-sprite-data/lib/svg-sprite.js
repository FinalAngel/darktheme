'use strict';
/**
 *
 *
 *
 * DISCLAIMER....
 *
 * This is NOT the work of @shakyShane - It's been 'borrowed' from https://github.com/jkphl/svg-sprite
 *
 * I wanted to have a tool that could create sprite-sheets without touching the file-system, this
 * allows me to use it as a base for other tools and plugins.
 *
 *
 *
 */
var _ = require('lodash'),
    path = require('path'),
    async = require('async'),
    SVGObj = require('./svg-obj.js'),
    defaultOptions = {
        prefix: 'svg',
        common: null,
        maxwidth: null,
        maxheight: null,
        padding: 0,
        layout: 'vertical',
        pseudo: '~',
        dims: false,
        keep: false,
        verbose: 0,
        render: {css: true},
        cleanwith: 'svgo',
        cleanconfig: {},
        selector: "%f",
        svgId: "%f"
    },
    svgoDefaults = [
//		{cleanupAttrs					: true}, // cleanup attributes from newlines, trailing and repeating spaces
//		{removeDoctype					: true}, // remove doctype declaration
//		{removeXMLProcInst				: true}, // remove XML processing instructions
//		{removeComments					: true}, // remove comments
//		{removeMetadata					: true}, // remove `<metadata>`
//		{removeTitle					: true}, // remove `<title>`
//		{removeEditorsNSData			: true}, // remove editors namespaces, elements and attributes
//		{removeEmptyAttrs				: true}, // remove empty attributes
//		{removeHiddenElems				: true}, // remove hidden elements
//		{removeEmptyText				: true}, // remove empty Text elements
//		{removeEmptyContainers			: true}, // remove empty Container elements
//		{removeViewBox					: true}, // remove `viewBox` attribute when possible
//		{cleanupEnableBackground		: true}, // remove or cleanup `enable-background` attribute when possible
//		{convertStyleToAttrs			: true}, // convert styles into attributes
//		{convertColors					: true}, // convert colors (from `rgb()` to `#rrggbb`, from `#rrggbb` to `#rgb`)
//		{convertPathData				: true}, // convert Path data to relative, convert one segment to another, trim useless delimiters and much more
//		{convertTransform				: true}, // collapse multiple transforms into one, convert matrices to the short aliases and much more
//		{removeUnknownsAndDefaults		: true}, // remove unknown elements content and attributes, remove attrs with default values
//		{removeNonInheritableGroupAttrs	: true}, // remove non-inheritable group's "presentation" attributes
//		{removeUnusedNS					: true}, // remove unused namespaces declaration
//		{cleanupIDs						: true}, // remove unused and minify used IDs
//		{cleanupNumericValues			: true}, // round numeric values to the fixed precision, remove default 'px' units
//		{moveElemsAttrsToGroup			: true}, // move elements attributes to the existing group wrapper
        {moveGroupAttrsToElems: false} // move some group attributes to the content elements
//		{collapseGroups					: true}, // collapse useless groups
//		{removeRasterImages				: false}, // remove raster images (disabled by default)
//		{mergePaths						: true}, // merge multiple Paths into one
//		{convertShapeToPath				: true}, // convert some basic shapes to path
//		{transformsWithOnePath			: true}, // apply transforms, crop by real width, center vertical alignment and resize SVG with one Path inside
    ];

/**
 * SVG Sprite generator
 *
 * @param {Object} options            Options
 * @return {SVGSprite}                SVG sprite generator instance
 * @throws {Error}
 */
function SVGSprite(options) {

    options = _.extend({}, options);

    // Validate & prepare the options
    this._options = _.extend(defaultOptions, options);
    this._options.prefix = (new String(this._options.prefix || '').trim()) || null;
    this._options.common = (new String(this._options.common || '').trim()) || null;
    this._options.maxwidth = Math.abs(parseInt(this._options.maxwidth || 1000, 10));
    this._options.maxheight = Math.abs(parseInt(this._options.maxheight || 1000, 10));
    this._options.padding = Math.abs(parseInt(this._options.padding, 10));
    this._options.pseudo = (new String(this._options.pseudo).trim()) || '~';
    this._options.dims = !!this._options.dims;
    this._options.verbose = Math.min(Math.max(0, parseInt(this._options.verbose, 10)), 3);
    this._options.render = _.extend({css: true}, this._options.render);
    this._options.cleanwith = (new String(this._options.cleanwith || '').trim()) || null;
    this._options.cleanconfig = _.extend({}, this._options.cleanconfig || {});
    this.namespacePow = [];

    // Reset all internal stacks
    this._reset();

    var SVGO = require('svgo');
    this._options.cleanconfig.plugins = svgoDefaults.concat(this._options.cleanconfig.plugins || []);
    this._cleaner = new SVGO(this._options.cleanconfig);
    this._clean = this._cleanSVGO;
}

/**
 * Reset the stack collections
 */
SVGSprite.prototype._reset = function () {

    this.sprite = [];
    this.data = {
        common: this._options.common,
        prefix: this._options.common || this._options.prefix,
        dims: this._options.dims,
        padding: this._options.padding,
        swidth: 0,
        sheight: 0,
        svg: [],
        date: (new Date()).toGMTString()
    };
};

/**
 * Clean an SVG file using SVGO
 *
 * @param {String} file                SVG file name
 * @param {Object} config            Cleaning configuration
 * @param {String} svg - file contents
 * @param {Function} callback        Callback
 */
SVGSprite.prototype._cleanSVGO = function (file, svg, config, callback) {

    var that = this;

    try {

        that._cleaner.optimize(svg, function (result) {

            var svgObj = SVGObj.createObject(file, result.data, that._options);

            if (that._options.verbose > 2) {
                var size = svgObj.toSVG(false).length,
                    saving = svg.length - size;

            }

            process.nextTick(function() { callback(null, svgObj); });
        });
    } catch (error) {

        callback(error, null);
    }
};

/**
 * Process all SVG files
 *
 * @param {Function} callback
 * @param tasks
 */
SVGSprite.prototype._processFiles = function (tasks, config, callback) {

    var that = this;

    async.parallel(tasks, function (error, results) {

        if (error) {
            callback(error);
            return;
        }

        var svgPseudos = {},
            svgIDs = Object.keys(results).sort(),
            lastSVGIndex = svgIDs.length - 1;

        svgIDs.forEach(function (svgID) {
            var svgPseudo = svgID.split(this._options.pseudo);
            svgPseudos[svgPseudo[0]] = svgPseudos[svgPseudo[0]] || (svgPseudo.length > 1);
        }, that);

        // Register all SVG files with the sprite
        svgIDs.forEach(function (svgID, index) {
            var svgElemId = this._options.svgId.replace("%f", svgID);
            this._addToSprite(svgElemId, results[svgID], svgPseudos[svgID], index == lastSVGIndex, config);
        }, that);

        callback(null);
    });
};

/**
 * @param filePath
 * @param contents
 * @param index
 * @param tasks
 */
SVGSprite.prototype.addFile = function (filePath, contents, index, tasks) {

    var that = this;

    var svgID = path.basename(filePath, path.extname(filePath));

    tasks[svgID] = function (_callback) {
        that._processFile(svgID, that._getFileNamespacePrefix(index), filePath, contents, _callback);
    };
};


/**
 * Return a unique SVG file namespace prefix
 *
 * @param {Number} index SVG file index
 * @return {String} SVG file namespace prefix
 */
SVGSprite.prototype._getFileNamespacePrefix = function (index) {
    if (!this.namespacePow.length) {
        do {
            this.namespacePow.unshift(Math.pow(26, this.namespacePow.length));
        } while (Math.pow(26, this.namespacePow.length) < 100);
    }
    for (var ns = '', n = 0, c; n < this.namespacePow.length; ++n) {
        c = Math.floor(index / this.namespacePow[n]);
        ns += String.fromCharCode(97 + c);
        index -= c * this.namespacePow[n];
    }
    return ns;
};

/**
 * Add a single SVG to the sprite
 *
 * @param {String} svgID SVG file ID
 * @param {SVGObj} svgInfo SVG info object
 * @param {Boolean} svgPseudo Add ":regular" pseudo class selector
 * @param {Boolean} isLastSVG Last SVG in sprite image order
 */
SVGSprite.prototype._addToSprite = function (svgID, svgInfo, svgPseudo, isLastSVG, config) {

    var dimensions = svgInfo.getDimensions(),
        rootAttr = {id: svgID},
        positionX = 0,
        positionY = 0;

    switch (this._options.layout) {

        // Horizontal sprite arrangement
        case 'horizontal':
            if (!config.inline) {
                rootAttr.x = this.data.swidth;
            }
            positionX = -this.data.swidth;

            this.data.swidth = Math.ceil(this.data.swidth + dimensions.width);
            this.data.sheight = Math.max(this.data.sheight, dimensions.height);
            break;

        // Diagonal sprite arrangement
        case 'diagonal':
            if (!config.inline) {
                rootAttr.x = this.data.swidth;
                rootAttr.y = this.data.sheight;
            }
            positionX = -this.data.swidth;
            positionY = -this.data.sheight;

            this.data.swidth = Math.ceil(this.data.swidth + dimensions.width);
            this.data.sheight = Math.ceil(this.data.sheight + dimensions.height);
            break;

        // Vertical sprite arrangement (default)
        default:
            if (!config.inline) {
                rootAttr.y = this.data.sheight;
            }
            positionY = -this.data.sheight;

            this.data.swidth = Math.max(this.data.swidth, dimensions.width);
            this.data.sheight = Math.ceil(this.data.sheight + dimensions.height);
    }

    // Set root attributes
    svgInfo.svg.root().attr(rootAttr);

    var viewBox = svgInfo.svg.root().attr("viewBox");

    // if (viewBox) {
    //     viewBox = viewBox.value();
    // }

    var children = svgInfo.svg.root().childNodes();
    // console.log('children', children);

    var raw = children.join("");

    // Register the single SVG with the sprite
    var data = svgInfo.toSVG(true);

    this.sprite.push(data);

    // Determine the CSS class name and pseudo class
    var cls = svgID.split(this._options.pseudo);

    var selector = this._options.selector.replace("%f", cls[0]);


    // Register the SVG parameters
    this.data.svg.push({
        name: svgID,
        height: dimensions.height - 2 * this._options.padding,
        width: dimensions.width - 2 * this._options.padding,
        last: isLastSVG,
        selector: (svgPseudo || (cls.length > 1)) ? [
            {
                expression: selector,
                raw: cls[0],
                first: true,
                last: false
            },
            {
                expression: ((cls.length > 1) ? selector : (selector + '\\:regular')),
                raw: ((cls.length > 1) ? selector : (selector + ':regular')),
                first: false,
                last: true
            }
        ] : [
            {
                expression: selector,
                raw: selector,
                first: true,
                last: true
            }
        ],
        positionX: positionX,
        positionY: positionY,
        position: this._addUnit(positionX) + ' ' + this._addUnit(positionY),
        dimensions: {
            selector: (cls.length == 1) ? [
                {
                    expression: selector + '-dims',
                    raw: selector + '-dims',
                    first: true,
                    last: true
                }
            ] : [
                {
                    expression: selector + '-dims:' + cls[1],
                    raw: selector + '-dims:' + cls[1],
                    first: true,
                    last: false
                },
                {
                    expression: selector + '\\:' + cls[1] + '-dims',
                    raw: selector + ':' + cls[1] + '-dims',
                    first: false,
                    last: true
                }
            ],
            width: dimensions.width,
            height: dimensions.height
        },
        data: data,
        raw: raw,
        viewBox: viewBox
    });
};

/**
 * Process a single SVG file
 *
 * @param {String} id                SVG file ID
 * @param {String} ns                SVG file namespace prefix
 * @param {String} filePath          SVG file name
 * @param {String} contents          File contents
 * @param {Function} callback        Callback
 */
SVGSprite.prototype._processFile = function (id, ns, filePath, contents, callback) {

    var that = this;
    async.waterfall([
        function (_callback) {

            that._clean(filePath, contents, that._options.cleanconfig, _callback);
        },
        function (svgInfo, _callback) {

            // Sanitize dimension settings and optionally scale the SVG
            svgInfo.prepareDimensions(_callback);
        },
        function (svgInfo, _callback) {

            // Add optional padding
            svgInfo.setPadding(_callback);
        },
        function (svgInfo, _callback) {

          // console.log('svgInfo');
          // console.log(svgInfo);

            // Namespace the IDs inside the SVG
            svgInfo.namespaceIDs(ns, _callback);
        },
        function (svgInfo, _callback) {
            _callback(null, svgInfo);
        }
    ], callback);
};

/**
 * Return the sprite SVG
 *
 * @return {SVGSprite} Self reference
 */
SVGSprite.prototype.toSVG = function () {
    var svg = [];
    svg.push('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + this.data.swidth + '" height="' + this.data.sheight + '" viewBox="0 0 ' + this.data.swidth + ' ' + this.data.sheight + '">');
    Array.prototype.push.apply(svg, this.sprite);
    svg.push('</svg>');
    return svg.join('');
};

/**
 * Return a coordinate (number) with 'px' appended if non-zero
 *
 * @param {Number} number Coordinate (number)
 * @return {String} Coordinate (number) with unit appended
 */
SVGSprite.prototype._addUnit = function (number) {
    return number + ((number != 0) ? 'px' : '');
};

/**
 * Main (exported) function
 *
 * @param {Object} options Options
 */
function createSprite(options) {

    try {
        return new SVGSprite(options);
    } catch (error) {
        return error;
    }
}

module.exports.createSprite = createSprite;
