// Packages
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const fs = require("fs");
const path = require("path");

// Files and other imports
const StoreRoutes = require("./routes/storeRoutes");
const ErrorHandler = require("./middlewares/errorHandler");

// Configurations
dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use(
  morgan("dev", {
    skip: function (req, res) {
      return res.statusCode < 400;
    },
  })
);

app.use(
  morgan("common", {
    stream: fs.createWriteStream(path.join(__dirname, "access.log"), {
      flags: "a",
    }),
  })
);

// Using Routers
app.use("/api/v1/store", StoreRoutes);

// Error Handler
app.use(ErrorHandler);

// Starting Server
const server = app.listen(PORT, (err) => {
  if (err) {
    return console.log(`Failed to start Server`);
  }
  console.log(`Listening to port ${PORT} in mode ${process.env.NODE_ENV}`);
});

// Handle Unhandled Promises
process.on("unhandledRejection", (err, Promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
