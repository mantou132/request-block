browser.devtools.panels.create(
  'Request Block',
  '/icons/block.svg',
  './panel/panel.html'
);
browser.runtime.sendMessage({
  type: 'open-devtools'
});
setInterval(() => {
  browser.runtime.sendMessage({
    type: 'open-devtools'
  });
}, 500);