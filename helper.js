function handleError() {
  let error = chrome.runtime.lastError;
  if (error) {
    console.log(error.message);
  }
}

function extractHostname(url) {
    var hostname;
    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }
    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];
    return hostname;
}

function isBlacklist(url, bad_domains) {
  let host = extractHostname(url);
  return bad_domains.includes(host);
}

