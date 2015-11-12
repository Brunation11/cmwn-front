/**
 * function to lazy load a JS file,
 * from https://github.com/LukasBombach/Lazyloader/blob/master/lazyloader.js
 * which includes support through ie5 and css onLoad, niether of
 * which we require.
 */

var Loader = function appendScriptAndCallCallback(url, callback) {
    var oScript = document.createElement('script');
    oScript.type = 'text/javascript';
    oScript.src = url;
    oScript.onload = callback;
    document.getElementsByTagName('head')[0].appendChild(oScript);
};

export default Loader;

