/*eslint-env node */
/**
 * Development Webpack Configuration
 */
var path = require('path');
var webpack = require('webpack');
var HappyPack = require('happypack');
var autoprefixer = require('autoprefixer');
var happyThreadPool = HappyPack.ThreadPool({ size: 5 });

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
        new webpack.DllReferencePlugin({
            context: '.',
            manifest: require('./build/vendor-manifest.json')
        }),
        createHappyPlugin('js', [
            {
                path: 'babel',
                query: {
                    plugins: ['transform-runtime'],
                    presets: ['react', 'es2015'],
                    cacheDirectory: false
                }
            }
        ]),
        createHappyPlugin('scss', [
            'style',
            'css',
            'postcss',
            'sass',
            'prepend?data=' + scssGlobals
        ])
    ],
    module: {
        loaders: [{
            test: /\.js$/,
            loaders: ['happypack/loader?id=js'],
            include: path.join(__dirname, 'src'),
        },
        {
            test: /\.css$/,
            loaders: ['style', 'css', 'postcss']
        },
        {
            test: /\.scss$/,
            loaders: ['happypack/loader?id=scss']
        },
        {
            test: /\.(jpe?g|png|gif|svg)$/i,
            loaders: [
                'file?hash=sha512&digest=hex&name=[hash].[ext]',
                'img?-minimize&progressive=true'
            ]
        }, {
            test: /\.woff$/,
            loaders: ['url?limit=100000']
        }]
    },
    sassLoader: {
        includePaths: [path.resolve(__dirname, './src')]
    },
    postcss: function () {
        return [autoprefixer];
    }
};


function createHappyPlugin(id, loaders) {
    return new HappyPack({
        id: id,
        loaders: loaders,
        threadPool: happyThreadPool,

        // disable happy caching with HAPPY_CACHE=0
        cache: process.env.HAPPY_CACHE !== '0',

        // make happy more verbose with HAPPY_VERBOSE=1
        verbose: process.env.HAPPY_VERBOSE !== '0',
    });
}

