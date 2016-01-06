/* eslint-disable */
var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev');

var app = express();
var compiler = webpack(config);

var PORT = 3000;

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
    if(/\.(?:png|jpg|gif|jpeg|bmp|js|ico)$/.test(req.path)) {
        console.log(req.path + ' : ' + path.resolve('./build/index.html'))
        res.sendFile(path.join(__dirname, 'build/' + req.path));
    } else {
        console.log(req.path + ' : ' + path.resolve('./build/index.html'))
        res.sendFile(path.resolve('./build/index.html'));
    }
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

var api = express ();
//api.get('/*', function(req, res) {
//    res.redirect(200, 'http://lapi.changemyworldnow.com'+req.path);
//})
var proxy = require('express-http-proxy');
api.use('/*', proxy('http://proxy.changemyworldnow.com', {
  forwardPath: function(req, res) {
    return require('url').parse(req.baseUrl).path;
  }
}));
api.listen(3001, 'localhost', function(err) {

    if (err) {
        console.log(err);
        return;
    }

    console.log('Listening at api');
})

