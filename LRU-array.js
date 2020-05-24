/**
 * [LUR-K（Least recently used）  最近被访问过，那么将来被访问过的几率也更高]
 * LRU: 缓存污染
 * LRU-k：一个历史队列，一个缓存队列。当数据访问次数达到K，数据放入缓存，内存消耗比LRU多，
 * TWO queue(2Q)：一个FIFO队列，一个LRU队列。数据第一次访问是，缓存到FIFO队列，第二次访问时，FIFO队列移到LRU队列，按照各自的方法淘汰数据
 * Multi Queue(MQ)：
 * 1、新数据插入到链表头部
 * 2、每当缓存命中（即缓存数据被访问），则将数据移到链表头部
 * 3、当链表满的时候，将链表尾部的数据丢弃
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
    // 定时清理缓存
    this.timer = setInterval(() => {
      this.clearExpiredData();
    }, 10 * 1000);
  }

  clearExpiredData() {
    let currentTime = parseInt(new Date().getTime() / 1000);
    for (const key in this.capacity) {
      let value = this.capacity[key];
      if (value.requestTime && value.duration > 0) {
        if (currentTime > value.requestTime + value.duration) {
          this.clear(key);
        }
      }
    }
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
      for (const iterator of keys.values()) {
        this.clear(iterator);
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

  clear(key) {
    delete this.capacity[key];
    localStorage.removeItem(key);
    let index = this.cacheMap.indexOf(key);
    index >= 0 && this.cacheMap.splice(index, 1);
    if (!Object.keys(this.capacity).length && !this.cacheMap.length) clearInterval(this.timer);
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