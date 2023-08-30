const mongoose = require("mongoose");
const mongo_uri = process.env.mongo_uri;

const connect = mongoose.connect(mongo_uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const connection = mongoose.connection;
connect.then(
  (db) => {
    console.log("Database Connected Successfully");
  },
  (err) => {
    console.log("Error occur while connecting ", err);
  }
);
module.exports = connection;
