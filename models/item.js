const mongoose = require('mongoose');

const ItemsSchema = new mongoose.Schema({
  tenant_id: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  // artifact_id: {
  //   type: String,
  //   required: true,
  //   trim: true,
  //   lowercase: true
  // },
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  is_video: {
    type: Boolean,
    required: true,
    default: 0
  },
  is_special: {
    type: Boolean,
    required: true,
    default: 0
  },
  expired_on: {
    type: Date
  },
  status: {
    type: Boolean,
    required: true,
    default: 1
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
    default: 0
  },
  is_coupon_applicable: {
    type: Boolean,
    required: true,
    default: 0
  },
  coupon_code: {
    type: String,
    trim: true,
    lowercase: true,
  },
  item_desc: {
    type: String,
    required: true
  },
  created_by: {
    type: String,
    required: true
  },
  updated_by: {
    type: String
  },
  created_on: {
    type: Date,
    required: true,
    default: Date.now
  },
  updated_on: {
    type: Date,
    default: Date.now
  },
  currency_code: {
    type: String,
    default: "AUD"
  }
});

module.exports = mongoose.model("items", ItemsSchema);