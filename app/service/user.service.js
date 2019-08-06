const User = require('../model/User');
const crypto = require('crypto');
const emailService = require('./email.service');
const _ = require('lodash');
const commonHelper = require('../helper/common.helper');
const otpHelper = require('../helper/otp.helper');
const {logoutAllDevices} = require('../service/auth.service');

module.exports.signUp = async (data) => {
    let user = new User(data);

    //password encryption
    user.password = crypto.pbkdf2Sync(user.password, process.env.PASSWORD_SALT,
        100, 64, `sha512`).toString(`hex`);

    let otp = otpHelper.generateOTP(user);
    if (otp.status && otp.res != null) {
        user.authorizationCode = otp.res;
        user.authorizationCodeExpiryTime = new Date();

        return new Promise((resolve, reject) => {
            user.save((err, user) => {
                if (err) {
                    reject(err.message);
                } else {
                    user = _.omit(user._doc, ['password', '_id', '__v']);
                    resolve(user);
                }
            });
        })
    } else {
        return Promise.reject(new Error('failed to generate OTP, user creation failed'));
    }
}

module.exports.resetPassword = async (data) => {
    if (!data.email) {
        return Promise.resolve({auth: false, message: 'please pass all the required parameters'});
    }
    return new Promise((resolve, reject) => {
        User.findOne({'email': data.email}).then(async (response) => {
            if (response) {
                try {
                    //send email to requester
                    let response = await emailService.sendEmail({
                        to: user.email,
                        subject: 'Password Reset Request',
                        type: 'RESET_PASSWORD'
                    });
                    return response;
                } catch (e) {
                    reject(new Error('failed to send email!'));
                }
            } else {
                reject(new Error('failed to resendPassword'));
            }
        })
    })
}

module.exports.changePassword = async (data) => {
    if (!data.body.newPassword) {
        return Promise.resolve({auth: false, message: 'please pass all the required parameters'});
    }
    let userId = await commonHelper.getUserIdFromToken(data.headers.token);
    if (userId) {
        return new Promise((resolve, reject) => {
            User.findOne({'_id': userId}, (err, user) => {
                if (err) {
                    reject(new Error('failed to changePassword'));
                } else {
                    //password encryption
                    user.password = crypto.pbkdf2Sync(data.body.newPassword, process.env.PASSWORD_SALT,
                        100, 64, `sha512`).toString(`hex`);
                    user.lastUpdated = Date.now();
                    user.save((err, user2) => {
                        if (err) {
                            resolve(new Error('failed to changePassword'));
                        } else {
                            logoutAllDevices(data.headers.token).then((response) => {
                                resolve('password changed successfully!');
                            });
                        }
                    });
                }
            })
        })
    } else {
        return Promise.resolve({auth: false, message: 'failed to authenticate token'});
    }
}
