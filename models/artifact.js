const mongoose = require('mongoose');

const ArtifactsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  item_id: {
    type: mongoose.Schema.Types.ObjectId, 
    ref:'items',
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },  
  status: {
    type: Boolean,
    required: true,
    default: 1
  },
  created_by: {
    type: String
  },
  updated_by: {
    type: String
  },
  created_on: {
    type: Date
  },
  updated_on: {
    type: Date
  }
});

module.exports = mongoose.model("artifacts", ArtifactsSchema);