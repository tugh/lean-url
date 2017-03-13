var blockedParams = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

function getParams(URL) {
    var splitURL = URL.split("?");
    if ( splitURL.length == 1 ) {
        return null;
    }

    var params = {};
    rawParams = URL.split("?")[1].split("&");

    for ( var i = 0; i < rawParams.length; i++ ) {
        var rawParam = rawParams[i].split('=');
        params[rawParam[0]] = rawParam[1];
    }

    return params;
}

function buildURL(baseURL, params) {
    if ( Object.keys(params).length == 0 ) {
        return baseURL;
    }

    var newURL = baseURL + "?";

    for ( var key in params ) {
        newURL += key + "=" + params[key] + "&";
    }
    newURL = newURL.slice(0, newURL.length-1);

    return newURL;
}

function cleanURL(details) {
    var baseURL = details.url.split("?")[0];

    var params = getParams(details.url);
    if ( params == null ) {
        return;
    }

    var reducedParams = {};
    for ( var key in params ) {
        if ( !blockedParams.includes(key) ) {
            reducedParams[key] = params[key];
        }
    }

    if ( Object.keys(reducedParams).length == Object.keys(params).length ) {
        return;
    }

    leanURL = buildURL(baseURL, reducedParams);
    return { redirectUrl: leanURL };
}

browser.webRequest.onBeforeRequest.addListener(
    cleanURL,
    {urls: ["<all_urls>"]},
    ["blocking"]
);
