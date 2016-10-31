if (!process.env.APP_MEDIA_URL) {
    process.env.APP_MEDIA_URL = "https://media-staging.changemyworldnow.com/f/";
}

function jsonToScssVars (obj, indent) {
    // Make object root properties into scss variables
    var scss = "";
    for (var key in obj) {
        scss += "$" + key + ":" + JSON.stringify(obj[key], null, indent) + ";\n";
    }

    // Store string values (so they remain unaffected)
    var storedStrings = [];
    scss = scss.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, function (str) {
        var id = "___JTS" + storedStrings.length;
        storedStrings.push({id: id, value: str});
        return id;
    });

    // Convert js lists and objects into scss lists and maps
    scss = scss.replace(/[{\[]/g, "(").replace(/[}\]]/g, ")");

    // Put string values back (now that we're done converting)
    storedStrings.forEach(function (str) {
        scss = scss.replace(str.id, str.value);
    });

    return scss;
}

module.exports = encodeURIComponent(jsonToScssVars(
    {
        "media-url": process.env.APP_MEDIA_URL
    }
));
