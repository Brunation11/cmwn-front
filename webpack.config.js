var path = require('path');

module.exports = {
    context: __dirname + "/src",
    entry: './app.js',
    output: {
        filename: 'build.js', //this is the default name, so you can skip it
        path: __dirname + '/build',
        //at this directory our bundle file will be available
        //make sure port 8090 is used when launching webpack-dev-server
        publicPath: 'http://localhost:8090/assets'
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
                loaders: ["babel-loader"]
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
    }
}
