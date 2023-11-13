const mongoose = require('mongoose');

const ItemsReviewSchema = new mongoose.Schema({  
  user_id: {
    type: String,
    required: true,
    trim: true
  },
  item_id: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },  
  comments: {
    type: Blob,
    required: false    
  },
  status: {
    type: Boolean,
    required: true,
    default: 1
  },
  created_on: {
    type: Date,
    required: true    
  },
  updated_on: {
    type: Date,
    required: true    
  }
});

module.exports = mongoose.model("itemsreview", ItemsReviewSchema);