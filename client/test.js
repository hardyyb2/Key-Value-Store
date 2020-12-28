const StoreClient = require("../library/clientLibrary");

const client = new StoreClient();

client.createKey("e", "abd").then((res) => console.log(res));
