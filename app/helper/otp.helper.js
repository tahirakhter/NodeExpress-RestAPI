'use strict';
const crypto = require('crypto');
const User = require('../model/User');
const ch = require('./common.helper');
const ObjectId = require('mongoose').Types.ObjectId;

class OTPHelper {
  static generateOTP(payload) {
    try {
      let { userName } = payload;
      if (!userName) {
        return { status: false, res: 'invalid payload' };
      }
      let random = crypto.randomBytes(512).toString('hex');
      let hash = crypto.createHmac('sha512', random);
      hash.update('CLIENT-OTP' + userName);
      let otp = hash.digest('hex');
      otp = otp.substring(0, 4).toUpperCase();
      return { status: true, res: otp };
    }
    catch (e) {
      return { status: false, res: null };
    }
  }

  static async verifyOTP(payload) {
    try {
      let { clientId, otp } = payload;
      if (!clientId || !otp) {
        return { status: false, res: 'invalid payload' };
      }
      let res = await User.findOne.findOne({
        _id: ObjectId(clientId),
        authorizationCode: otp
      });
      if (res) {
        let minutes = ch.getDateDiff(res.authorizationCodeExpiryTime);
        if (minutes > process.env.OTP_EXPIRY_TIME) { // otp expiry time 15 minutes
          return { status: false, res: 'OTP has been expired!' };
        }
        return { status: true, res: 'valid OTP' };

      }
      return { status: false, res: 'invalid OTP' };

    }
    catch (e) {
      return { status: false, res: 'internal server error' };
    }
  }

}

module.exports = OTPHelper;
