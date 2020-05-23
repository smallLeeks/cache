/**
 * [FIFO（First In First Out）  先进先出]
 * 1、新访问的数据插入队列尾部，数据在FIFO队列中顺序移动
 * 2、淘汰FIFO队列头部的数据
 */
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
    this.MAX_LENGTH = 10;
    this.cacheMap = [];
    this.capacity = {};
  }

  /**
   * 保存数据到内存中
   * @param {String} key 
   * @param {Object} value 
   * @param {Number} duration 
   */
  put(key, value, duration = -1) {
    if (key) {
      this.capacity[key] = {
        requestTime: parseInt(new Date().getTime() / 1000),
        data: value,
        duration
      }
      this.sortKey(key);
    }
  }
  
  /**
   * 保存数据到内存和localStorage中
   * @param {String} key 
   * @param {Object} value 
   * @param {Number} duration 
   */
  putLocalStorage(key, value, duration = -1) {
    if (key) {
      this.capacity[key] = {
        requestTime: parseInt(new Date().getTime() / 1000),
        data: value,
        duration
      }
      localStorage.setItem(
        key,
        JSON.stringify(this.capacity[key])
      );
      this.sortKey(key);
    }
  }

  sortKey(key) {
    let index = this.cacheMap.indexOf(key);
    if (index >= 0) {
      let array = this.cacheMap.splice(index, 1);
      this.cacheMap.push(array[0]);
    } else {
      this.cacheMap.push(key);
    }
    if (this.cacheMap.length > this.MAX_LENGTH) {
      let keys = this.cacheMap.splice(0, this.cacheMap.length - this.MAX_LENGTH);
      for (const [key, value] of keys.entries()) {
        this.clear(key, value);
      }
    }
  }

  get(key) {
    let data = this.capacity[key];
    if (!data) {
      data = localStorage.getItem(key);
      if (data) this.capacity[key] = data;
    }
    data && this.sortKey(key);
    return data;
  }

  clear(key, value) {
    delete this.capacity[value];
    localStorage.removeItem(key);
    let index = this.cacheMap.indexOf(key);
    index >= 0 && this.cacheMap.splice(index, 1);
  }

  clearAllMemory() {
    this.capacity = {};
  }

  clearAllCache() {
    this.capacity = {};
    localStorage.clear();
  }

  /**
   * 获取特定时间内的缓存数据
   * @param {String} key
   * @param {Number} duration
   * @return {Object} 
   */
  getSpecificData(key, duration = -1) {
    let cachedData = this.get(key);
    if (cachedData && (duration < 0 || (cachedData.requestTime && parseInt(new Date().getTime() / 1000) - cachedData.requestTime <= duration))) return cachedData;
    return '';
  }
}