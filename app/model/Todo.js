'use strict';
const mongoose = require('mongoose');

module.exports = mongoose.model('Todo', new mongoose.Schema({
  task: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  status: {
    type: Boolean,
    default: true,
    required: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})
);
