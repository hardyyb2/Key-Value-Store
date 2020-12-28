const fetch = require("isomorphic-unfetch");
const dotenv = require("dotenv");

dotenv.config();

const BASE_PATH = `http://localhost:3000/api/v1/store`;

class StoreClient {
  constructor() {
    // this.basePath = process.env.BASE_PATH;
    this.basePath = BASE_PATH;
  }

  request(endpoint = "", options = {}) {
    let url = this.basePath + endpoint;

    let headers = {
      api_key: this.api_key,
      "Content-type": "application/json",
    };

    let config = {
      ...options,
      ...headers,
    };

    return fetch(url, config).then((r) => {
      return r.json();
    });
  }

  getKey(key) {
    const options = {
      method: "GET",
    };

    return this.request(`/${key}`, options);
  }

  createKey(key, val) {
    const options = {
      method: "POST",
      body: JSON.stringify({ key, val }),
    };
    return this.request("", options);
  }

  deleteKey(key) {
    const options = {
      method: "DELETE",
    };
    return this.request(`/${key}`, options);
  }
}

module.exports = StoreClient;
