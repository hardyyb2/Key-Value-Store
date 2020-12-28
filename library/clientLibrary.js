const fetch = require("isomorphic-unfetch");
require("dotenv").config();

class StoreClient {
  constructor() {
    this.basePath = process.env.BASE_PATH;
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
      if (r.ok) {
        return r.json();
      }
      throw new Error(r);
    });
  }

  getKey(key) {
    const options = {
      method: "GET",
      body: JSON.stringify({ key }),
    };

    return this.request("", options);
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
      body: JSON.stringify({ key }),
    };
    return this.request("", options);
  }
}

const client = new StoreClient();

client.getKey("a");

module.exports = StoreClient;
