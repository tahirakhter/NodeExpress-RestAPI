'use strict';
const mongoose = require('mongoose');

module.exports = mongoose.model('User', new mongoose.Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  gender: {
    type: Boolean,
    default: null
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    trim: true,
    required: [true, 'cannot be empty.']
  },
  userName: {
    type: String,
    lowercase: true,
    unique: true,
    trim: true,
    required: [true, 'cannot be empty.']
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['ADMIN', 'USER'],
    default: 'USER'
  },
  authorizationCode: {
    type: String,
    default: null
  },
  authorizationCodeExpiryTime: {
    type: Date,
    default: null
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
