/* eslint-disable */
var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev');

var app = express();
var compiler = webpack(config);

var PORT = 80;

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

//app.get('/*(.png|.jpg|.gif|.jpeg|.bmp|.js)', function(req, res) {
//    console.log(req.path + ' : ' +path.join(__dirname, req))
//    res.sendFile(path.join(__dirname, req));
//});

app.get('/*', function(req, res) {
    //res.send(Object.stringify(req));
    //if(req == '/'){
    console.log(req.path + ' : ' + path.resolve('./build/index.html'))
        res.sendFile(path.resolve('./build/index.html'));
    //} else {
    //    res.sendFile(path.join(__dirname, req));
    //}
});

//app.get('/*', function(req, res) {
//    res.sendFile(path.join(__dirname, req.path));
//});
//app.get('*', function(req, res) {
//    res.sendFile(path.join(__dirname, 'index.html'));
//});

app.listen(PORT, 'localhost', function(err) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('Listening at http://localhost:' + PORT);
});
