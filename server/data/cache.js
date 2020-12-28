const CACHE_SIZE = 40;

class LRUCache {
  constructor(capacity) {
    this.cache = new Map();
    this.capacity = capacity;
  }

  exists(key) {
    if (this.cache.get(key)) {
      return true;
    }
    return false;
  }

  add(key, val, expires) {
    this.cache.delete(key);

    this.cache.set(key, { val, expires });

    if (this.cache.size > this.capacity) {
      this.cache.delete(this.cache.keys().next().value);
    }
  }

  get(key) {
    if (!this.cache.has(key)) return -1;

    let val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);

    return this.cache.get(key);
  }

  delete(key) {
    this.cache.delete(key);
  }
}

const cache = new LRUCache(CACHE_SIZE);

module.exports = cache;
