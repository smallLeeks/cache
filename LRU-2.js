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
    this.MAX_LENGTH = 20;
    this.cacheMap = new Map();
    this.capacity = {};
  }

  get() {
    if (this.cacheMap.has(key)) {
      // 有命中，更改该值在堆栈中的顺序
      let temp = this.capacity.get(key);
      this.cacheMap.delete(key);
      this.cacheMap.set(key, temp);
      return temp;
    } else {
      return -1;
    }
  }

  put(key, value) {
    if (this.cacheMap.has(key)) {
      this.cacheMap.delete(key);
      this.cacheMap.set(key, value);
    } else {
      // 没有命中
      if (this.cacheMap.size >= this.capacity) {
        // 堆栈已满，清除一个数据
        // map的key返回一个iterator迭代器，然后用一次next获取第一个元素
        let firstKey = this.capacity.keys().next().value;
        this.cacheMap.delete(firstKey);
        this.capacity.set(key, value);
      } else {
        // 堆栈未满，存数据
        this.cacheMap.set(key, value);
      }
    }
  }
}