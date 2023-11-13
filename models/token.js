const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  tenant_id: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  role_id: {
    type: String,
    required: true
  }
});

const Token = mongoose.model("token", tokenSchema);

module.exports = Token;