const mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  first_name: String,
  last_name: String,
});

module.exports = mongoose.model("User", UserSchema);
