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
    this.keys = [];
    this.data = {};
  }

  /**
   * 保存数据到内存中
   * @param {Array} key 
   * @param {Object} data 
   * @param {Number} duration 
   */
  setData(key, data, duration = -1) {
    if (key) {
      this.data[key] = {
        requestTime: parseInt(new Date().getTime() / 1000),
        data,
        duration
      }
      this.sortKey(key);
    }
  }
  
  /**
   * 保存数据到内存和localStorage中
   * @param {Array} key 
   * @param {Object} data 
   * @param {Number} duration 
   */
  setLocalStorage(key, data, duration = -1) {
    if (key) {
      this.data[key] = {
        requestTime: parseInt(new Date().getTime() / 1000),
        data,
        duration
      }
      localStorage.setItem(
        key,
        JSON.stringify(this.data[key])
      );
      this.sortKey(key);
    }
  }

  sortKey(key) {
    let index = this.keys.indexOf(key);
    // 放至队列尾部
    if (index >= 0) {
      let array = this.keys.splice(index, 1);
      this.keys.push(array[0]);
    } else {
      this.keys.push(key);
    }
    // 超出缓存的数量，删除头部最不常用的数据
    if (this.keys.length > this.MAX_LENGTH) {
      let keys = this.keys.splice(0, this.keys.length - this.MAX_LENGTH);
      for (const key in keys) {
        this.clearData(key);
      }
    }
  }

  getData(key) {
    let data = this.data[key];
    if (!data) {
      data = localStorage.getItem(key);
      if (data) this.data[key] = data;
    }
    data && this.sortKey(key);
    return data;
  }

  clearData(key) {
    delete this.data[key];
    localStorage.removeItem(key);
    let index = this.keys.indexOf(key);
    index >= 0 && this.keys.splice(index, 1);
  }

  clearAllMemory() {
    this.data = {};
  }

  clearAllCache() {
    this.data = {};
    localStorage.remove();
  }

  /**
   * 获取特定时间内的缓存数据
   * @param {Array} key
   * @param {Number} duration
   * @return {Object} 
   */
  getSpecificData(key, duration = -1) {
    let cachedData = this.getData(key);
    if (cachedData && (duration < 0 || (cachedData.requestTime && parseInt(new Date().getTime() / 1000) - cachedData.requestTime <= duration))) return cachedData;
    return '';
  }
}