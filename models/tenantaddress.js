const mongoose = require("mongoose");

const tenantAddressSchema = new mongoose.Schema({
  tenant_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  address: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  created_by: {
    type: String,
  },
  updated_by: {
    type: String,
  },
  created_on: {
    type: Date,
  },
  updated_on: {
    type: Date,
  },
});

const tenantAddress = mongoose.model("tenant_address", tenantAddressSchema);

module.exports = tenantAddress; 