'use strict';
const { getUserSession, logout, logoutAllDevices, authenticateUser } = require('../service/auth.service');

// get user session on token
module.exports.getUserSession = (req, res) => {
  try {
    getUserSession(req.headers.token).then((response) => {
      res.status(200).json(response);
    }).catch((e) => {
      res.status(500).json(e.message || e);
    });
  }
  catch (e) {
    res.status(500).json(e.message);
  }
};

// logout user
module.exports.logout = (req, res) => {
  try {
    logout(req.headers.token).then((response) => {
      res.status(200).json(response);
    });
  }
  catch (e) {
    res.status(500).json(e.message);
  }
};

// logout all user tokens
module.exports.logoutAllDevices = (req, res) => {
  try {
    logoutAllDevices(req.headers.token).then((response) => {
      res.status(200).json(response);
    });
  }
  catch (e) {
    res.status(500).json(e.message);
  }
};

// login user
module.exports.authenticateUser = (req, res) => {
  try {
    authenticateUser(req).then((response) => {
      res.status(200).json(response);
    });
  }
  catch (e) {
    res.status(500).json(e.message);
  }
};
