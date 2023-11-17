const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerify: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const UserModel = mongoose.model("user", schema);

module.exports = UserModel;
