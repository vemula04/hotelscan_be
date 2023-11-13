const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  tenant_id: {
    type: String,
    required: true,
    trim: true
  },
  artifact_id: {
    type: String,
    required: true,
    trim: true
  },
  role_id: {
    type: String,
    required: true,
    trim: true
  },
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  middlename: {
    type: String,
    required: false,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  is_verified: {
    type: Boolean,
    required: true,
    default: 0,
  },
  verification_code: {
    type: String,
    required: false
  },
  is_social_login: {
    type: Boolean,
    required: true,
    default: 0,
  },
  social_network_name: {
    type: String,
    required: false,
    default: "",
    trim: true
  },
  mobile_no: {
    type: String,
    required: false,
    default: "",
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  is_whatsapp_enabled: {
    type: Boolean,
    required: true,
    default: 0,
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  is_link_expired: {
    type: Boolean,
    required: true,
    default: 0,
  },
  status: {
    type: Boolean,
    required: true,
    default: 1,
  },
  item_price: {
    type: String,
    required: true,
    trim: true,
  },
  promotional_price: {
    type: String,
    required: true,
    trim: true,
  },
  is_promotional_applicable: {
    type: Boolean,
    required: true,
    default: 0,
  },
  is_coupon_applicable: {
    type: Boolean,
    required: true,
    default: 0,
  },
  coupon_code: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  created_by: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  updated_by: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  created_on: {
    type: Date,
    required: true,
  },
  updated_on: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("user", UserSchema);
