chrome.tabs.onCreated.addListener(function(tab) {
  if (tab.url === "chrome://newtab/") return;

  // is parent blacklist
  chrome.tabs.get(tab.openerTabId, function(tabParent) {
    if (tabParent.url === "chrome://newtab/") return;

    chrome.storage.sync.get({bad_domains: []}, function(data) {
      let bad_domains = data.bad_domains;

      if (isBlacklist(tabParent.url, bad_domains)) {
        chrome.tabs.remove(tab.id, handleError);
      }
    });
  });
});
