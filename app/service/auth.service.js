'use strict';
const User = require('../model/User');
const UserLogin = require('../model/UserLogin');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const commonHelper = require('../helper/common.helper');
const _ = require('lodash');

class AuthService {
  static async getUserSession(token) {
    try {
      let userId = await commonHelper.getUserIdFromToken(token);
      if (!_.isEmpty(userId)) {
        let user = await User.findById(userId, { password: 0, _id: 0, __v: 0 });
        if (user) {
          return user;
        }
        throw new Error('user not found!');
      }
      throw new Error('failed to authenticate token');
    }
    catch (err) {
      // Log Errors
      throw new Error(err.message || err);
    }
  }

  static async logout(token) {
    try {
      let user = await UserLogin.deleteOne({ 'token': token });
      if (user) {
        return { auth: false, token: null, message: 'logout successfully!' };
      }
      throw new Error('Server Error Unable to Logout');
    }
    catch (err) {
      // Log Errors
      throw new Error(err.message || err);
    }
  }

  static async logoutAllDevices(token) {
    try {
      let userId = await commonHelper.getUserIdFromToken(token);
      if (userId) {
        let userLogin = UserLogin.deleteMany({ 'userId': userId });
        if (userLogin) {
          return { auth: false, token: null, message: 'all devices logout successfully!' };
        }
        throw new Error('server error unable to logout all devices');
      }
      throw new Error('failed to authenticate token');
    }
    catch (err) {
      // Log Errors
      throw new Error(err.message || err);
    }
  }

  static async authenticateUser(data) {
    let userInfo = new User(data.body);
    let os = data.headers['user-agent'];
    if (!userInfo.userName || !userInfo.password) {
      throw new Error('please pass all the required parameters!');
    }
    try {
      let user = await User.findOne({ 'userName': userInfo.userName });
      if (user) {
        // creating hash from password to compare
        let hashedPassword = crypto.pbkdf2Sync(userInfo.password,
          process.env.PASSWORD_SALT, 100, 64, 'sha512').toString('hex');
        if (_.isEqual(hashedPassword, user.password)) {
          let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: 3600 // expires in 1 hour
          });

          let userLogin = await UserLogin.findOne({ 'userId': user._id, 'status': true, 'os': os });
          if (userLogin) {
            return { auth: true, token: userLogin.token };
          }
          else {
            let obj = {
              userId: user._id.toString(),
              token: token,
              deviceAddress: '',
              lat: '',
              long: '',
              os: os,
              ipAddress: ''
            };
            let userLogin = new UserLogin(obj);
            let userLoginRes = userLogin.save();
            if (userLoginRes) {
              return { auth: true, token: token };
            }
            throw new Error('login failed!');
          }
        }
        throw new Error('incorrect password!');
      }
      throw new Error('incorrect userName!');
    }
    catch (err) {
      // Log Errors
      throw new Error(err.message || err);
    }
  }

}

module.exports = AuthService;
