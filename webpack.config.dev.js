/* eslint-disable */
/**
 * Development Webpack Configuration
 */
var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'eval-source-map',
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
            loaders: ['babel'],
            include: path.join(__dirname, 'src')
        },
        {
            test: /\.css$/,
            loaders: ['style', 'css', 'autoprefixer']
        },
        {
            test: /\.scss$/,
            loaders: ['style', 'css', 'autoprefixer', 'sass']
        },
        {
            test: /\.(jpe?g|png|gif|svg)$/i,
            loaders: [
                'file?hash=sha512&digest=hex&name=[hash].[ext]',
                'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
            ]
        }, {
            test: /\.woff$/,
            loader: 'url?limit=100000'
        }]
    },
    sassLoader: {
        includePaths: [path.resolve(__dirname, './src')]
    }
};

