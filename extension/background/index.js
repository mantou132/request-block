import blockSetting from './setting.js';
import {throttle} from '../utils/timer.js';

let devtoolsIsOpen = false;
const throttleCloseDevTools = throttle(() => devtoolsIsOpen = false, 1000);

const requestHandler = ({url}) => {
  if (!devtoolsIsOpen || !blockSetting.enabled) return;
  const result = blockSetting.check(url);
  if (!result) return;
  const {enabled, redirectUrl} = result;
  if (!enabled) return;
  if (redirectUrl) {
    console.warn(`${url} redirect to ${redirectUrl}`);
    return {redirectUrl};
  }
  console.warn(`${url} be block`);
  return {cancel: true};
};

browser.webRequest.onBeforeRequest.addListener(
  requestHandler,
  {urls: ['<all_urls>']},
  ['blocking']
);



browser.runtime.onMessage.addListener(({type, data}) => {
  if (type === 'open-devtools') {
    devtoolsIsOpen = true;
    throttleCloseDevTools()
  }
  if (type === 'get-request-block-setting') {
    return Promise.resolve(blockSetting.json());
  }
  if (type === 'request-block-enabled') {
    return blockSetting.enabled();
  }
  if (type === 'request-block-disabled') {
    return blockSetting.disabled();
  }
  if (type === 'request-block-toggle') {
    return blockSetting.toggle();
  }
  if (type === 'request-block-clear') {
    return blockSetting.clear();
  }
  if (type === 'request-block-add') {
    return blockSetting.addItem(data);
  }
  if (type === 'request-block-delete') {
    return blockSetting.deleteItem(data);
  }
  if (type === 'request-block-enabled-item') {
    return blockSetting.enabledItem(data);
  }
  if (type === 'request-block-disabled-item') {
    return blockSetting.disabledItem(data);
  }
  if (type === 'request-block-toggle-item') {
    return blockSetting.toggleItem(data);
  }
});