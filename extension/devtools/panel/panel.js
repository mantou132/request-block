const render = (list = []) => {
  document.body.innerHTML = list;
};

const getCurrentRequest = () => browser.runtime.sendMessage({
  type: 'get-current-request',
  tabId: browser.devtools.inspectedWindow.tabId,
}).then(render);

browser.runtime.onMessage.addListener(({type, data}) => {
  if (type === 'send-current-request') {
    return render(data);
  }
});

getCurrentRequest();
