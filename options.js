function removeDomain(domain, callback) {
  chrome.storage.sync.get({bad_domains: []}, function(data) {
    let bad_domains = data.bad_domains;
    let index = bad_domains.indexOf(domain);
    if (index > -1) {
      bad_domains.splice(index, 1);
      chrome.storage.sync.set({bad_domains: bad_domains}, callback);
      renderDomainList(bad_domains);
    }
  });
}

function renderDomainList(domains) {
  let table = document.getElementById('bad-domain-list');
  table.innerHTML = '';
  for (let domain of domains) {
    let row = document.createElement('tr');
    let domain_el = document.createElement('td');
    domain_el.innerHTML = domain;
    row.appendChild(domain_el);
    let delete_el = document.createElement('td');
    let delete_link = document.createElement('a');
    delete_link.innerHTML = 'Delete';
    delete_link.href = '';
    delete_link.onclick = function() {
      removeDomain(domain, handleError);
      return false;
    };
    delete_el.appendChild(delete_link);
    row.appendChild(delete_el);
    table.appendChild(row);
  }
}

let form = document.getElementById('new-domains');
form.onsubmit = function() {
  let domains = form.domains.value.split(/\s+/).filter(Boolean);
  chrome.storage.sync.get({bad_domains: []}, function(data) {
    let bad_domains = data.bad_domains;
    let new_domains = bad_domains.concat(domains);

    chrome.storage.sync.set({bad_domains: new_domains}, handleError);
    renderDomainList(new_domains);
  });
  form.domains.value = '';
  return false;
};

chrome.storage.sync.get({bad_domains: []}, function(data) {
  renderDomainList(data.bad_domains);
});
