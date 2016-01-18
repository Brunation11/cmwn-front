<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="ie6"> <![endif]-->
<!--[if IE 7]>         <html class="ie7"> <![endif]-->
<!--[if IE 8]>         <html class="ie8"> <![endif]-->
<!--[if IE 9]>         <html class="ie9"> <![endif]-->
<!--[if gt IE 9]><!--> <html>         <!--<![endif]-->
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" >
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">
        <noscript><meta http-equiv="X-Frame-Options" content="DENY" /></noscript>
        <title>Change My World Now</title>
        <style>
            @font-face {
                font-family: "CMWNJadeRegular";
                src: url("/fonts/cmwn.woff") format("woff");
   :        }
        </style>
        <!-- inject:reset -->
        <!-- endinject -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/css/bootstrap.min.css" integrity="sha512-dTfge/zgoMYpP7QbHy4gWMEGsbsdZeCXz7irItjcC3sPUFtf0kuFbDz/ixG7ArTxmDjLXDmezHubeNikyKGVyQ==" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/humane-js/3.2.2/themes/flatty.min.css" crossorigin="anonymous">
        <!-- inject:style -->
        <!-- endinject -->
        <!-- inject:env -->
        <!-- endinject -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/xdomain/0.7.3/xdomain.min.js" ></script>
        <!--[if IE]>
            <script>
                xdomain.debug = true;
                xdomain.slaves({
                    'https://*.changemyworldnow.com': '/proxy.html',
                    'https://papi.changemyworldnow.com': '/proxy.html',
                    'https://changemyworldnow.com': '/proxy.html'
                });
            </script>
        <![endif]-->
    </head>
    <body>
        <div id="pageerror"><a href="/login"> </a></div>
        <div id="cmwn-app"></div>
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
            <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.3.14/polyfill.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/flexie/1.0.3/flexie.min.js"></script>
        <![endif]-->
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
        <!-- app:js -->
        <!-- endinject -->
        <script src='https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit' async defer></script>
        <?php 
            echo "<script>";
            foreach ($_SERVER as $key=>$val) {
                if (strrpos($key, "APP_", -strlen($key)) !== FALSE) {
                    echo 'window.__cmwn.'.substr(explode("=", $key)[0], 4)." = '".str_replace('_', '.', explode("=", $key)[1])."';\n";
                }
            }
            echo "</script>";
         ?>
    </body>
</html>
