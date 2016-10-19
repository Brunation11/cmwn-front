/*eslint-env node */
/**
 * Development Webpack Configuration
 */
var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

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
    devtool: 'cheap-source-map',
    resolve: {
        root: path.resolve('./src'),
        extensions: ['', '.js']
    },
    entry: [
        'webpack-hot-middleware/client',
        'app'
    ],
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'build.js',
        publicPath: '/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [{
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



