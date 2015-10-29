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
        './src/app.js'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'build.js',
        publicPath: '/build/'
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
            test: /\.scss$/,
            loaders: ['style', 'css', 'sass']
        }]
    }
};

