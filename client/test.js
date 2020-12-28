const StoreClient = require("../library/clientLibrary");

const client = new StoreClient();

client.getKey("a").then((res) => {
  console.log(res);
});
