const StoreClient = require("../library/clientLibrary");

const client = new StoreClient();

client.createKey("p", { abd: "abd" }).then((res) => console.log(res));
