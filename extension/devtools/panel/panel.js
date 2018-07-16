const globalStateEle = document.querySelector('#global-state');
const listEle = document.querySelector('#items');
const newItemEle = document.querySelector('#new-item');
const newItemContentEle = document.querySelector('#new-tiem-content');
const newItemContentRedirectEle = document.querySelector('#new-tiem-content-redirect');

document.onclick = e => {
  e.preventDefault();
  if (e.target.dataset.action === 'toggle-global-state') {
    browser.runtime.sendMessage({
      type: 'request-block-toggle'
    }).then(() => {
      globalStateEle.checked = !globalStateEle.checked;
      if (globalStateEle.checked) {
        listEle.classList.remove('disabled');
      } else {
        listEle.classList.add('disabled');
      }
    });
  }
  if (e.target.dataset.action === 'toggle-item-state') {
    browser.runtime.sendMessage({
      type: 'request-block-toggle-item',
      data: e.target.dataset.data
    }).then(() => {
      const input = e.target.querySelector('input');
      input.checked = !input.checked;
    });
  }
  if (e.target.dataset.action === 'request-block-clear') {
    browser.runtime.sendMessage({
      type: 'request-block-clear',
    }).then(() => {
      listEle.innerHTML = '';
    });
  }
  if (e.target.dataset.action === 'add-new-item') {
    newItemEle.hidden = false;
    newItemContentEle.value = '';
    newItemContentEle.focus();
  }
  if (e.target.dataset.action === 'save-create-item') {
    const pattern = newItemContentEle.value;
    const redirectUrl = newItemContentRedirectEle.value;
    const data = {enabled: true, redirectUrl};
    newItemContentEle.value && browser.runtime.sendMessage({
      type: 'request-block-add',
      data: {pattern, data}
    }).then(() => {
      newItemEle.hidden = true;
      listEle.prepend(createItem(pattern, data));
    });
  }
  if (e.target.dataset.action === 'cancel-create-item') {
    newItemEle.hidden = true;
  }
  if (e.target.dataset.action === 'delete-item') {
    browser.runtime.sendMessage({
      type: 'request-block-delete',
      data: e.target.dataset.data
    }).then(() => {
      e.target.closest('li').remove();
    });
  }
}

const createItem = (pattern, {enabled, redirectUrl}, df = document.createDocumentFragment()) => {
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = enabled;
  
  const span = document.createElement('span');
  span.textContent = redirectUrl ? `${pattern} redireact to ${redirectUrl}` : pattern;
  
  const label = document.createElement('label');
  label.dataset.action = 'toggle-item-state';
  label.dataset.data = pattern;
  label.append(input);
  label.append(span);

  const button = document.createElement('button');
  button.dataset.action = 'delete-item';
  button.dataset.data = pattern;
  button.textContent = '删除';

  const li = document.createElement('li');
  li.append(label);
  li.append(button);

  df.append(li);
  return df;
};

browser.runtime.sendMessage({
  type: 'get-request-block-setting'
}).then(({enabled, list = [[]]}) => {
  if (!enabled) listEle.classList.add('disabled');
  globalStateEle.checked = enabled;
  const df = document.createDocumentFragment();
  list.forEach(([pattern, data]) => {
    createItem(pattern, data, df);
  });
  listEle.append(df);
});