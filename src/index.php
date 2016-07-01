<?php
$https = isset($_SERVER['HTTPS']) && ($_SERVER['HTTPS'] === 'on');
$proxy = isset($_SERVER['HTTP_X_FORWARDED_PROTO']) ? $_SERVER['HTTP_X_FORWARDED_PROTO'] : null;

if (!$https && $proxy !== 'https') {
    $newUrl = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    header("HTTP/1.1 301 Moved Permanently");
    header('Location: ' . $newUrl);
    die();
}
?>
<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="ie ie6"> <![endif]-->
<!--[if IE 7]>         <html class="ie ie7"> <![endif]-->
<!--[if IE 8]>         <html class="ie ie8"> <![endif]-->
<!--[if IE 9]>         <html class="ie ie9"> <![endif]-->
<!--[if gt IE 9]><!--> <html>         <!--<![endif]-->
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" >
        <meta charset="UTF-8">
        <meta name="referrer" content="origin">
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">
        <noscript><meta http-equiv="X-Frame-Options" content="DENY" /></noscript>
        <title>Change My World Now</title>
        <style>
            @font-face {
                font-family: "CMWNJadeRegular";
                src: url("/fonts/cmwn.woff") format("woff");
            }
        </style>
        <!-- inject:reset -->
        <!-- endinject -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/css/bootstrap.min.css" integrity="sha512-dTfge/zgoMYpP7QbHy4gWMEGsbsdZeCXz7irItjcC3sPUFtf0kuFbDz/ixG7ArTxmDjLXDmezHubeNikyKGVyQ==" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/humane-js/3.2.2/themes/flatty.min.css" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/sweetalert2/3.2.3/sweetalert2.min.css" crossorigin="anonymous">
        <!-- inject:style -->
        <!-- endinject -->
        <!--[if IE]>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/xdomain/0.7.3/xdomain.min.js" crossorigin="anonymous"></script>
            <script>
                xdomain.debug = true;
                xdomain.slaves({
                    'https://*.changemyworldnow.com': '/proxy.html',
                    'https://papi.changemyworldnow.com': '/proxy.html',
                    'https://changemyworldnow.com': '/proxy.html'
                });
            </script>
        <![endif]-->
        <!-- inject:env -->
        <!-- endinject -->
        <?php
            echo "<script>\n";
            echo "window.__cmwn = window.__cmwn || {};\n";
            foreach ($_SERVER as $key=>$val) {
                if (strrpos($key, "APP_", -strlen($key)) !== FALSE) {
                    echo 'window.__cmwn.'.substr($key, 4)." = '".str_replace('_', '.', $val)."';\n";
                }
            }
            $package = file_get_contents('./package.json');
            $packageJSON = json_decode($package, true);
            echo "window.__cmwn.VERSION = '".$packageJSON['version']."';\n";
            echo "</script>";
         ?>
    </head>
    <body>
        <div id="pageerror"><a href="/login"> </a></div>
        <div id="cmwn-app"></div>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.3.14/polyfill.min.js" crossorigin="anonymous"></script>
        <!--[if lte IE 9]>
            <script>
            (function(){
            var ef = function(){};
            window.console = window.console || {log:ef,warn:ef,error:ef,dir:ef};
            }());
            </script>
            <script src="//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.2/html5shiv.min.js"></script>
            <script src="//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.2/html5shiv-printshiv.min.js"></script>
            <script src="//cdnjs.cloudflare.com/ajax/libs/es5-shim/3.4.0/es5-shim.js"></script>
            <script src="//cdnjs.cloudflare.com/ajax/libs/es5-shim/3.4.0/es5-sham.js"></script>
        <![endif]-->
        <!--[if IE]>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/flexie/1.0.3/flexie.min.js"></script>
        <![endif]-->
        <script type="text/javascript">
            var isIE10 = false;
            var fileref;
            /*@cc_on
                if (/^10/.test(@_jscript_version)) {
                    isIE10 = true;
                }
            @*/
            if (!(window.ActiveXObject) && "ActiveXObject" in window && navigator.userAgent.match(/Trident.*rv[ :]*11\./)) {
                document.getElementsByTagName('html')[0].className += ' ie ie11';
            }
            if (isIE10){
                document.getElementsByTagName('html')[0].className += ' ie ie10';
                fileref=document.createElement('script');
                fileref.setAttribute("type","text/javascript");
                fileref.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/xdomain/0.7.3/xdomain.min.js");
                document.head.appendChild(fileref);
            }
            //polyfill localstorage
            if (window.localStorage == null) {
                fileref=document.createElement('script');
                fileref.setAttribute("type","text/javascript");
                fileref.setAttribute("src", "//cdnjs.cloudflare.com/ajax/libs/localStorage/2.0.1/localStorage.min.js");
                document.head.appendChild(fileref);
            }
            try {
                //will fail in private safari
                window.localStorage.setItem('testKey', '1');
                window.localStorage.removeItem('testKey');
            } catch (error) {
                //we dont rely on localstorage as a source of truth
                //so we can safely ignore these errors
                Storage.prototype._setItem = Storage.prototype.setItem;
                Storage.prototype.setItem = function() {};
            }
        </script>
        <script>
            var style = document.createElement('style');
            style.appendChild(document.createTextNode(''));
            document.head.appendChild(style);
            if (document.styleSheets[0].addRule != null){
                style.sheet.addRule('#pageerror', 'display:none;', 0);
            } else if (document.styleSheets[0].insertRule != null) {
                style.sheet.insertRule('#pageerror{display:none;}', 0);
            }
        </script>
        <!-- rollbar -->
        <script>
        var _rollbarConfig = {
            accessToken: "4635aacc2d3645a48e99c947e3a75a8d",
            captureUncaught: true,
            payload: {
                environment: __cmwn.MODE,
                client: {
                  javascript: {
                    source_map_enabled: true,
                    code_version: __cmwn.VERSION,
                    // Optionally have Rollbar guess which frames the error was thrown from
                    // when the browser does not provide line and column numbers.
                    guess_uncaught_frames: true
                  }
                }
            }
        };
        ;
        // Rollbar Snippet
        !function(r){function o(e){if(t[e])return t[e].exports;var n=t[e]={exports:{},id:e,loaded:!1};return r[e].call(n.exports,n,n.exports,o),n.loaded=!0,n.exports}var t={};return o.m=r,o.c=t,o.p="",o(0)}([function(r,o,t){"use strict";var e=t(1).Rollbar,n=t(2);_rollbarConfig.rollbarJsUrl=_rollbarConfig.rollbarJsUrl||"https://d37gvrvc0wt4s1.cloudfront.net/js/v1.8/rollbar.min.js";var a=e.init(window,_rollbarConfig),i=n(a,_rollbarConfig);a.loadFull(window,document,!_rollbarConfig.async,_rollbarConfig,i)},function(r,o){"use strict";function t(r){return function(){try{return r.apply(this,arguments)}catch(o){try{console.error("[Rollbar]: Internal error",o)}catch(t){}}}}function e(r,o,t){window._rollbarWrappedError&&(t[4]||(t[4]=window._rollbarWrappedError),t[5]||(t[5]=window._rollbarWrappedError._rollbarContext),window._rollbarWrappedError=null),r.uncaughtError.apply(r,t),o&&o.apply(window,t)}function n(r){var o=function(){var o=Array.prototype.slice.call(arguments,0);e(r,r._rollbarOldOnError,o)};return o.belongsToShim=!0,o}function a(r){this.shimId=++s,this.notifier=null,this.parentShim=r,this._rollbarOldOnError=null}function i(r){var o=a;return t(function(){if(this.notifier)return this.notifier[r].apply(this.notifier,arguments);var t=this,e="scope"===r;e&&(t=new o(this));var n=Array.prototype.slice.call(arguments,0),a={shim:t,method:r,args:n,ts:new Date};return window._rollbarShimQueue.push(a),e?t:void 0})}function l(r,o){if(o.hasOwnProperty&&o.hasOwnProperty("addEventListener")){var t=o.addEventListener;o.addEventListener=function(o,e,n){t.call(this,o,r.wrap(e),n)};var e=o.removeEventListener;o.removeEventListener=function(r,o,t){e.call(this,r,o&&o._wrapped?o._wrapped:o,t)}}}var s=0;a.init=function(r,o){var e=o.globalAlias||"Rollbar";if("object"==typeof r[e])return r[e];r._rollbarShimQueue=[],r._rollbarWrappedError=null,o=o||{};var i=new a;return t(function(){if(i.configure(o),o.captureUncaught){i._rollbarOldOnError=r.onerror,r.onerror=n(i);var t,a,s="EventTarget,Window,Node,ApplicationCache,AudioTrackList,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload".split(",");for(t=0;t<s.length;++t)a=s[t],r[a]&&r[a].prototype&&l(i,r[a].prototype)}return r[e]=i,i})()},a.prototype.loadFull=function(r,o,e,n,a){var i=function(){var o;if(void 0===r._rollbarPayloadQueue){var t,e,n,i;for(o=new Error("rollbar.js did not load");t=r._rollbarShimQueue.shift();)for(n=t.args,i=0;i<n.length;++i)if(e=n[i],"function"==typeof e){e(o);break}}"function"==typeof a&&a(o)},l=!1,s=o.createElement("script"),u=o.getElementsByTagName("script")[0],p=u.parentNode;s.crossOrigin="",s.src=n.rollbarJsUrl,s.async=!e,s.onload=s.onreadystatechange=t(function(){if(!(l||this.readyState&&"loaded"!==this.readyState&&"complete"!==this.readyState)){s.onload=s.onreadystatechange=null;try{p.removeChild(s)}catch(r){}l=!0,i()}}),p.insertBefore(s,u)},a.prototype.wrap=function(r,o){try{var t;if(t="function"==typeof o?o:function(){return o||{}},"function"!=typeof r)return r;if(r._isWrap)return r;if(!r._wrapped){r._wrapped=function(){try{return r.apply(this,arguments)}catch(o){throw o._rollbarContext=t()||{},o._rollbarContext._wrappedSource=r.toString(),window._rollbarWrappedError=o,o}},r._wrapped._isWrap=!0;for(var e in r)r.hasOwnProperty(e)&&(r._wrapped[e]=r[e])}return r._wrapped}catch(n){return r}};for(var u="log,debug,info,warn,warning,error,critical,global,configure,scope,uncaughtError".split(","),p=0;p<u.length;++p)a.prototype[u[p]]=i(u[p]);r.exports={Rollbar:a,_rollbarWindowOnError:e}},function(r,o){"use strict";r.exports=function(r,o){return function(t){if(!t&&!window._rollbarInitialized){var e=window.RollbarNotifier,n=o||{},a=n.globalAlias||"Rollbar",i=window.Rollbar.init(n,r);i._processShimQueue(window._rollbarShimQueue||[]),window[a]=i,window._rollbarInitialized=!0,e.processPayloads()}}}}]);
        // End Rollbar Snippet
        </script>
        <!-- app:js -->
        <!-- endinject -->
        <script src='https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit' async defer></script>
        <script>
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

          ga('create', 'UA-26000499-1', 'auto');
          ga('require', 'linkid');
          ga('require', 'displayfeatures');
          ga('send', 'pageview');

        </script>
    </body>
</html>
