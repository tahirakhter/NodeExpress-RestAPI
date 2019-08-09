'use strict';
const userService = require('../service/user.service');

// user signup
module.exports.signUp = async(req, res) => {
  try {
    let response = await userService.signUp(req.body);
    res.status(200).json(response);
  }
  catch (err) {
    res.status(500).json(err.message || err);
  }
};

// user rest password request
module.exports.resetPassword = async(req, res) => {
  try {
    let response = await userService.resetPassword(req.body);
    res.status(200).json(response);
  }
  catch (err) {
    res.status(500).json(err.message || err);
  }
};

// change/update password
module.exports.changePassword = async(req, res) => {
  try {
    let response = await userService.changePassword(req);
    res.status(200).json(response);
  }
  catch (err) {
    res.status(500).json(err.message || err);
  }
};
