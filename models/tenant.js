const mongoose = require('mongoose');

const TenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  url: {
    type: String,
    required: true
  },
  primary_color: {
    type: String,
    required: true
  },
  secondary_color: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  status: {
    type: Boolean,
    default: 1
  },
  created_by: {
    type: String,
    required: true
  },
  updated_by: {
    type: String
  },
  created_on: {
    type: Date
  },
  updated_on: {
    type: Date
  },
  currency_code: {
    type: String,
    default: "AUD"
  }
});

//, {strict: false}

module.exports = mongoose.model("Tenant", TenantSchema);