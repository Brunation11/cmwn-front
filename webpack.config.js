var path = require('path');
var webpack = require('webpack');

module.exports = {
    context: __dirname + "/src",
    entry: [
        './app.js'
    ],
    output: {
        filename: 'build.js', //this is the default name, so you can skip it
        path: __dirname + '/build',
        //at this directory our bundle file will be available
        //make sure port 8090 is used when launching webpack-dev-server
        publicPath: 'http://localhost:8080/assets'
    },
    module: {
        loaders: [
            {
                //tell webpack to use jsx-loader for all *.jsx files
                test: /\.jsx$/,
                loader: 'jsx-loader?insertPragma=React.DOM&harmony'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: [
                    //"react-hot",
                    "babel-loader"
                ]
            }
        ]
    },
    externals: {
        //don't bundle the 'react' npm package with our bundle.js
        //but get it from a global 'React' variable
        //'react': 'React'
    },
    resolve: {
        root: path.resolve('./src'),
        extensions: ['', '.js', '.jsx']
    },
    resolveLoader: {
        modulesDirectories: ['node_modules']
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]

}
