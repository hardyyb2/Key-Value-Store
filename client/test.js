const StoreClient = require("../library/clientLibrary");

const client = new StoreClient();

client.createKey("a", "abd").then((res) => console.log(res));
