const argv = require('minimist')(process.argv.slice(2));
const plugins = [];
const webpack = require('webpack');
const path = require('path');


process.env.NODE_ENV = (argv.debug) ? 'development' : 'production';

plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
        name: 'themeScript',
        chunks: ['themeScript'],
    })
);

// add plugins depending on if we are debugging or not
if (argv.debug) {
    plugins.push(
        new webpack.LoaderOptionsPlugin({
            minimize: false,
            debug: true,
        })
    );
    plugins.push(
        new webpack.DefinePlugin({
            DEBUG: 'true',
        })
    );
} else {
    plugins.push(new webpack.optimize.ModuleConcatenationPlugin());
    plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
    plugins.push(
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        })
    );
    plugins.push(
        new webpack.DefinePlugin({
            DEBUG: 'false',
        })
    );
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: {
                screw_ie8: true,
                keep_fnames: true,
            },
            compress: {
                screw_ie8: true,
            },
            comments: false,
        })
    );
}

module.exports = {
    devtool: argv.debug ? 'cheap-module-eval-source-map' : false,
    entry: {
        themeScript: path.join(__dirname, 'themeScript.js'),
    },
    output: {
        path: path.join(__dirname, '..', '..'),
        filename: '[name].js',
        publicPath: '',
    },
    plugins: plugins,
    resolve: {
        modules: [__dirname, 'node_modules'],
        alias: {
            // make sure that we always use our jquery when loading 3rd party plugins
            jquery: require.resolve('jquery'),
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        retainLines: true,
                    },
                }],
                exclude: /(node_modules|vendor|libs|addons\/jquery.*)/,
                include: __dirname,
            },
        ],
    },
}

// disable DeprecationWarning: loaderUtils.parseQuery() DeprecationWarning
process.noDeprecation = true;
