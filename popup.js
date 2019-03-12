chrome.storage.sync.get({bad_domains: []}, function(result) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    let disable_new_tab = document.getElementById('disable_new_tab');
    let currentTab = tabs[0];
    let bad_domains = result.bad_domains;
    let url = currentTab.url;
    let host = extractHostname(url);

    if (!url || !host) return;

    disable_new_tab.checked = bad_domains.includes(host);
    disable_new_tab.addEventListener('change', function() {
      if (this.checked) {
        bad_domains.push(host);
      } else {
        let index = bad_domains.indexOf(host);
        if (index > -1) bad_domains.splice(index, 1);
      }
      // update bad domains storage
      chrome.storage.sync.set({bad_domains: bad_domains}, handleError);
    });
  });
});
