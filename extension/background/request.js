import {debounce} from '../utils/timer.js';

export const requestSet = {};

const sendCurrentRequest = debounce(set => {
  if (set.sender) {
    browser.runtime.sendMessage(set.sender.extensionId, {
      type: 'send-current-request',
      data: [...set.request]
    });
  }
}, 500, 2000);

const requestHandler = ({tabId, url}) => {
  if (!requestSet[tabId]) {
    requestSet[tabId] = {sender: null, request: new Set};
  }
  if (!requestSet[tabId].request.has(url)) {
    requestSet[tabId].request.add(url);
    sendCurrentRequest(requestSet[tabId]);
  }
};

browser.webRequest.onBeforeSendHeaders.addListener(
  requestHandler,
  {urls: ['<all_urls>']},
  ['blocking', 'requestHeaders']
);