/*eslint-env node */
/**
 * Production Webpack configuration
 */
var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

var scssGlobals = require('./scss_globals.js');

module.exports = {
    devtool: 'source-map',
    resolve: {
        root: path.resolve('./src'),
        extensions: ['', '.js']
    },
    entry: [
        'app'
    ],
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'build.js',
        publicPath: '/'
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'BABEL_ENV': JSON.stringify('production'),
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            mangle: {},
            compressor: {
                warnings: false
            },
            output: {
                comments: function (node, comment) {
                    var text = comment.value;
                    var type = comment.type;
                    if (type === 'comment2') {
                        // multiline comment
                        return (/@copyright/i).test(text);
                    }
                }
            }
        })
    ],
    module: {
        loaders: [{
            test: /dev_reducers|devtool/,
            loader: 'null'
        },
        {
            test: /\.js$/,
            loader: 'babel',
            include: path.join(__dirname, 'src'),
            query: {
                presets: ['react', 'es2015']
            }
        },
        {
            test: /\.css$/,
            loaders: ['style', 'css', 'postcss']
        },
        {
            test: /\.scss$/,
            loaders: [
                'style',
                'css',
                'postcss',
                'sass',
                'prepend?data=' + scssGlobals
            ]
        },
        {
            test: /\.(jpe?g|png|gif|svg)$/i,
            loaders: [
                'file?hash=sha512&digest=hex&name=[hash].[ext]',
                'img?-minimize&progressive=true'
            ]
        }, {
            test: /\.woff$/,
            loader: 'url?limit=100000'
        }]
    },
    sassLoader: {
        includePaths: [path.resolve(__dirname, './src')]
    },
    postcss: function () {
        return [autoprefixer];
    }
};

