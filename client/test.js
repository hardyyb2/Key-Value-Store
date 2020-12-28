const StoreClient = require("../library/clientLibrary");

const client = new StoreClient();

client.createKey("c", { abd: "abd" }, 1).then((res) => console.log(res));
