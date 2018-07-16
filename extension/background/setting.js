class BlockSetting {
  constructor () {
    this.list = new Map;
    this.enabled = false;
    this.init = browser.storage.local.get().then(({enabled, list}) => {
      if (list) this.list = list;
      if (enabled) this.enabled = enabled;
    });
  }
  async enabled () {
    await browser.storage.local.set({enabled: true});
    this.enabled = true;
  }
  async disabled () {
    await browser.storage.local.set({enabled: false});
    this.enabled = false;
  }
  async toggle () {
    await browser.storage.local.set({enabled: !this.enabled});
    this.enabled = !this.enabled;
  }
  async clear () {
    await browser.storage.local.set({list: new Map});
    this.list = new Map;
  }
  async addItem ({pattern, data}) {
    // if (this.list.has(item)) throw new Error('some item');
    await browser.storage.local.set({
      list: new Map(this.list).set(pattern, data)
    });
    this.list.set(pattern, data);
  }
  async deleteItem (pattern) {
    const temp = new Map(this.list)
    temp.delete(pattern);
    await browser.storage.local.set({
      list: temp
    });
    this.list.delete(pattern);
  }
  async enabledItem (pattern) {
    const data = this.list.get(pattern);
    const nextData = {...data, enabled: true};
    await browser.storage.local.set({
      list: new Map(this.list).set(pattern, nextData)
    });
    this.list.set(pattern, nextData);
  }
  async disabledItem (pattern) {
    const data = this.list.get(pattern);
    const nextData = {...data, enabled: false};
    await browser.storage.local.set({
      list: new Map(this.list).set(pattern, nextData)
    });
    this.list.set(pattern, nextData);
  }
  async toggleItem (pattern) {
    const data = this.list.get(pattern);
    const nextData = {...data, enabled: !data.enabled};
    await browser.storage.local.set({enabled: nextData});
    this.list.set(pattern, nextData);
  }
  json () {
    return {
      enabled: this.enabled,
      list: [...this.list]
    }
  }
  /**
   * @param {string} str 检查都 url
   * @return {object|undefined} result
   * @return {boolean} result.enabled
   * @return {string} result.redirectUrl
   */
  check (str) {
    for (const [item, data] of this.list) {
      if (item === str) return data;
      try {
        if (new RegExp(item).exec(str)) return data;
      } catch (e) {
        //
      }
    }
  }
}

export default new BlockSetting;
