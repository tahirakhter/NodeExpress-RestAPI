'use strict';
const { signUp, resetPassword, changePassword } = require('../service/user.service');

// user signup
module.exports.signUp = (req, res) => {
  try {
    signUp(req.body).then((response) => {
      res.status(200).json(response);
    }).catch((e) => {
      res.status(500).json(e.message || e);
    });
  }
  catch (e) {
    res.status(500).json(e.message);
  }
};

// user rest password request
module.exports.resetPassword = (req, res) => {
  try {
    resetPassword(req.body).then((response) => {
      res.status(200).json(response);
    });
  }
  catch (e) {
    res.status(500).json(e.message || 'error!');
  }
};

// change/update password
module.exports.changePassword = (req, res) => {
  try {
    changePassword(req).then((response) => {
      res.status(200).json(response);
    });
  }
  catch (e) {
    res.status(500).json(e.message);
  }
};
