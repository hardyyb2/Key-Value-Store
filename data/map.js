class Maps {
  constructor() {
    this.map = [];
  }

  add(key, val) {
    this.map[key] = val;
    return;
  }

  get(key) {
    return this.map[key];
  }

  delete(key) {
    delete this.map[key];
  }
}

const map = new Maps();

module.exports = map;
