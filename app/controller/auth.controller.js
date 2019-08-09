'use strict';
const authService = require('../service/auth.service');

// get user session on token
module.exports.getUserSession = async(req, res) => {
  try {
    let response = await authService.getUserSession(req.headers.token);
    res.status(200).json(response);
  }
  catch (err) {
    res.status(500).json(err.message || err);
  }
};

// logout user
module.exports.logout = async(req, res) => {
  try {
    let response = await authService.logout(req.headers.token);
    res.status(200).json(response);
  }
  catch (err) {
    res.status(500).json(err.message || err);
  }
};

// logout all user tokens
module.exports.logoutAllDevices = async(req, res) => {
  try {
    let response = await authService.logoutAllDevices(req.headers.token);
    res.status(200).json(response);
  }
  catch (err) {
    res.status(500).json(err.message || err);
  }
};

// login user
module.exports.authenticateUser = async(req, res) => {
  try {
    let response = await authService.authenticateUser(req);
    res.status(200).json(response);
  }
  catch (err) {
    res.status(500).json(err.message || err);
  }
};
