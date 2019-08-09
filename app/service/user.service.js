'use strict';
const User = require('../model/User');
const crypto = require('crypto');
const emailService = require('./email.service');
const _ = require('lodash');
const commonHelper = require('../helper/common.helper');
const otpHelper = require('../helper/otp.helper');
const { logoutAllDevices } = require('../service/auth.service');

class UserService {
  static async signUp(data) {
    let user = new User(data);

    // password encryption
    user.password = crypto.pbkdf2Sync(user.password, process.env.PASSWORD_SALT,
      100, 64, 'sha512').toString('hex');

    let otp = otpHelper.generateOTP(user);
    if (otp.status && otp.res !== null) {
      user.authorizationCode = otp.res;
      user.authorizationCodeExpiryTime = new Date();
      try {
        let result = await user.save();
        if (!_.isEmpty(result)) {
          result = _.omit(result._doc, ['password', '_id', '__v']);
          return result;
        }
        throw new Error('user creation failed');
      }
      catch (err) {
        // Log Errors
        throw new Error(err.message || err);
      }
    }
    throw new Error('failed to generate OTP, user creation failed');
  }

  static async resetPassword(data) {
    if (!data.email) {
      return Promise.resolve({ auth: false, message: 'please pass all the required parameters' });
    }

    try {
      let user = await User.findOne({ 'email': data.email });
      if (!_.isEmpty(user)) {
        let otp = otpHelper.generateOTP(user);
        if (otp.status && otp.res !== null) {
          user.authorizationCode = otp.res;
          user.authorizationCodeExpiryTime = new Date();
        }
        // saving newly generated OTP
        let result = await user.save();
        if (!_.isEmpty(result)) {
          let emailSent = await emailService.sendEmail({
            to: user.email,
            subject: 'Password Reset Request',
            type: 'RESET_PASSWORD',
            otp: otp.res
          });
          if (!_.isEmpty(emailSent)) {
            return emailSent;
          }
          throw new Error('failed to send email!');
        }
        throw new Error('password reset failed!');
      }
      throw new Error('no such email found!');
    }
    catch (err) {
      // Log Errors
      throw new Error(err.message || err);
    }
  }

  static async changePassword(data) {
    if (!data.body.newPassword) {
      return Promise.resolve({ auth: false, message: 'please pass all the required parameters' });
    }
    try {
      // get user id from user token
      let userId = await commonHelper.getUserIdFromToken(data.headers.token);
      if (userId) {
        // get user from id
        let user = await User.findOne({ '_id': userId });
        if (user) {
          // password encryption
          user.password = crypto.pbkdf2Sync(data.body.newPassword, process.env.PASSWORD_SALT,
            100, 64, 'sha512').toString('hex');
          user.lastUpdated = Date.now();
          // updating new password
          let userUpdated = await user.save();
          if (userUpdated) {
            let logOut = await logoutAllDevices(data.headers.token);
            if (logOut) {
              return { message: 'password changed successfully!' };
            }
          }
          throw new Error('failed to changePassword');
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

}

module.exports = UserService;
