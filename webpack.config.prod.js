/*eslint-env node */
/**
 * Production Webpack configuration
 */
var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

if (!process.env.APP_MEDIA_URL) {
    process.env.APP_MEDIA_URL = "https://media-staging.changemyworldnow.com/f/";
}

var jsonToScssVars = function (obj, indent) {
    // Make object root properties into scss variables
    var scss = "";
    for (var key in obj) {
        scss += "$" + key + ":" + JSON.stringify(obj[key], null, indent) + ";\n";
    }

    // Store string values (so they remain unaffected)
    var storedStrings = [];
    scss = scss.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, function (str) {
        var id = "___JTS" + storedStrings.length;
        storedStrings.push({id: id, value: str});
        return id;
    });

    // Convert js lists and objects into scss lists and maps
    scss = scss.replace(/[{\[]/g, "(").replace(/[}\]]/g, ")");

    // Put string values back (now that we're done converting)
    storedStrings.forEach(function (str) {
        scss = scss.replace(str.id, str.value);
    });

    return scss;
}

var scss = encodeURIComponent(jsonToScssVars({"media-url": process.env.APP_MEDIA_URL}));

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
                "prepend?data=" + scss
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

