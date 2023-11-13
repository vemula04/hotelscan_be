const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RolesSchema = new Schema({
  name: {
    type: String,
    required: true
  },  
  status: {
    type: Boolean,
    required: true,
    default: 1
  },
  created_by: {
    type: String,
    required: true
  },
  updated_by: {
    type: String,
    required: true
  },
  created_on: {
    type: Date,
    required: true,
    default: Date.now
  },
  updated_on: {
    type: Date,
    required: true,
    default: Date.now    
  }
});

module.exports = mongoose.model("roles", RolesSchema);