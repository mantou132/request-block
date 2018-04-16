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
  async add (item) {
    // if (this.list.has(item)) throw new Error('some item');
    await browser.storage.local.set({
      list: new Map(this.list).set(item, true)
    });
    this.list.set(item, true);
  }
  async delete (item) {
    const temp = new Map(this.list)
    temp.delete(item);
    await browser.storage.local.set({
      list: temp
    });
    this.list.delete(item);
  }
  async enabledItem (item) {
    await browser.storage.local.set({
      list: new Map(this.list).set(item, true)
    });
    this.list.set(item, true);
  }
  async disabledItem (item) {
    await browser.storage.local.set({
      list: new Map(this.list).set(item, false)
    });
    this.list.set(item, false);
  }
  async toggleItem (item) {
    const nextState = !this.list.get(item);
    await browser.storage.local.set({enabled: nextState});
    this.list.set(item, nextState);
  }
  json () {
    return {
      enabled: this.enabled,
      list: [...this.list]
    }
  }
  isMatch (str) {
    for (const [item, enabled] of this.list) {
      if (enabled) {
        if (item === str) return true;
        try {
          if (new RegExp(item).exec(str)) return true;
        } catch (e) {
          //
        }
      }
    }
  }
}

export default new BlockSetting;
