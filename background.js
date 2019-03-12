function addRuleAllowAll() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {urlMatches: '.'},
        })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
}

function isBlacklist(url, bad_domains) {
  let host = extractHostname(url);
  return bad_domains.includes(host);
}

chrome.runtime.onInstalled.addListener(function() {
  addRuleAllowAll();

  chrome.tabs.onCreated.addListener(function(tab) {
    if (tab.url === "chrome://newtab/") return;

    chrome.storage.sync.get({bad_domains: []}, function(data) {
      let bad_domains = data.bad_domains;

      // is parent blacklist
      chrome.tabs.get(tab.openerTabId, function(tabParent) {
        if (tabParent.url === "chrome://newtab/") return;

        if (isBlacklist(tabParent.url, bad_domains)) {
          chrome.tabs.remove(tab.id, handleError);
        } else if (tabParent.openerTabId) {
          // is grandparent blacklist
          chrome.tabs.get(tabParent.openerTabId, function(tabGrandParent) {
            if (tabGrandParent.url === "chrome://newtab/") return;

            if (isBlacklist(tabGrandParent.url, bad_domains)) {
              chrome.tabs.remove(tab.id, handleError);
            }
          });
        }
      });
    });
  });
});