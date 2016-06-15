/* eslint-disable */
var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev');
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('./server.key', 'utf8');
var certificate = fs.readFileSync('./server.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var app = express();
var compiler = webpack(config);

var PORT = 3000;
var APIPORT = 3001;
var SSHPORT = 3002;
var SSHAPIPORT = 3004;

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
    if(/\.(?:png|jpg|gif|jpeg|bmp|js|ico|woff)$/.test(req.path)) {
        console.log(req.path + ' : ' + path.resolve('./build/index.php'))
        res.sendFile(path.join(__dirname, 'build/' + req.path));
    } else {
        console.log(req.path + ' : ' + path.resolve('./build/index.php'))
        res.sendFile(path.resolve('./build/index.php'));
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

/*app.listen(PORT, 'localhost', function(err) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('Listening at http://localhost:' + PORT);
});*/

//var api = express ();
//api.get('/*', function(req, res) {
//    res.redirect(200, 'http://lapi.changemyworldnow.com'+req.path);
//})
//var proxy = require('express-http-proxy');
//api.use('/*', proxy('http://proxy.changemyworldnow.com', {
//  forwardPath: function(req, res) {
//    return require('url').parse(req.originalUrl).path;
//  }
//}));
/*api.listen(3001, 'localhost', function(err) {

    if (err) {
        console.log(err);
        return;
    }

    console.log('Listening at api');
})*/
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(PORT);
httpsServer.listen(SSHPORT);
/*var apiHttpServer = http.createServer(api);
var apiHttpsServer = https.createServer(credentials, api);

apiHttpServer.listen(APIPORT);
apiHttpsServer.listen(SSHAPIPORT);*/
