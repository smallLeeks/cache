class cache {
  /**
   * [instance 当前实例]
   */
  static instance;

  /**
   * [getInstance 获取单例]
   * @method getInstance
   * @return
   */
  static getInstance() {
    if (false === this.instance instanceof this) {
      this.instance = new this;
    }
    return this.instance;
  }

  constructor() {
    this.map = new Map(); // key => value
    this.mapKey = new Map(); // key => num
    this.capacity = 10;
  }

  set(key, value) {
    if (Object.is(this.capacity, 0)) return;
    let min = Math.min(...this.mapKey.values());
    if (this.map.has(key)) {
      this.map.set(key, value);
      let num = this.mapKey.get(key);
      this.mapKey.set(key, num + 1);
    } else {
      this.map.set(key, value);
      this.mapKey.set(key, 1);
    }
    if (this.map.size > this.capacity) {
      let keys = this.map.keys();
      let deleteKey = keys.next().value;
      while (!Object.is(this.mapKey.get(deleteKey), min)) {
        deleteKey = keys.next().value;
      }
      this.map.delete(deleteKey);
      this.mapKey.delete(deleteKey);
    }
  }

  get(key) {
    if (this.map.has(key)) {
      let num = this.mapKey.get(key);
      let value = this.map.get(key);
      this.map.delete(key);
      this.mapKey.set(key, num + 1);
      this.map.set(key, value);
      return value;
    } else {
      return -1;
    }
  }
}