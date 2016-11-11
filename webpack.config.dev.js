/*eslint-env node */
/**
 * Development Webpack Configuration
 */
var path = require('path');
var webpack = require('webpack');
var HappyPack = require('happypack');
var autoprefixer = require('autoprefixer');

var scssGlobals = require('./scss_globals.js');

module.exports = {
    cache: true,
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
        new webpack.NoErrorsPlugin(),
        new HappyPack({
            cache: process.env.HAPPY_CACHE ===  '1',
            loaders: [
                {
                    path: 'babel',
                    query: {
                        plugins: ['transform-runtime'],
                        presets: ['react', 'es2015'],
                        cacheDirectory: false
                    }
                }
            ],
            threads: 2
        })
    ],
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'happypack/loader',
            include: path.join(__dirname, 'src'),
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



