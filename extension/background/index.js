import {requestSet} from './request.js';

browser.runtime.onMessage.addListener(({type, tabId}, sender) => {
  if (type === 'get-current-request') {
    const set = requestSet[tabId];
    if (set) {
      set.sender = sender;
      return Promise.resolve([...set.request]);
    }
  }
});

browser.tabs.onRemoved.addListener(tabId => {
  delete requestSet[tabId];
});

browser.tabs.onUpdated.addListener((tabId, {status}) => {
  if (status === 'loading') {
    if (requestSet[tabId]) {
      requestSet[tabId].request = new Set;
    }
  }
});

