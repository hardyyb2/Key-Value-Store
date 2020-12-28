const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const BASE_PATH = process.env.BASE_PATH || `http://localhost:3000/api/v1/store`;

class StoreClient {
  constructor() {
    this.basePath = BASE_PATH;
  }

  request(endpoint = "", options = {}) {
    let url = this.basePath + endpoint;
    let headers = {
      Accept: "application/json",
      "Content-type": "application/json",
    };

    let config = {
      ...options,
      headers,
    };

    return axios({
      url,
      ...config,
    })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err.response.data;
      });
  }

  getKey(key) {
    const options = {
      method: "get",
    };

    return this.request(`/${key}`, options);
  }

  createKey(key, val) {
    const options = {
      method: "post",
      data: JSON.stringify({ key, val }),
    };
    return this.request("", options);
  }

  deleteKey(key) {
    const options = {
      method: "delete",
    };
    return this.request(`/${key}`, options);
  }
}

module.exports = StoreClient;
