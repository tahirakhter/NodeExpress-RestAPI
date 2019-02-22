const User = require('../model/User');
const bcrypt = require('bcrypt');
const emailService = require('./email.service');
const utility = require('./utility.service');
const _ = require('lodash');

module.exports.signUp = async (data) => {
    let user = new User(data);
    //password encryption
    user.password = bcrypt.hashSync(user.password, 10, function (err, hash) {
        if (err) {
            return 'password encryption failed';
        } else {
            hash;
        }
    });

    return new Promise((resolve, reject) => {
        user.save((err, user) => {
            if (err) {
                reject(new Error('failed to create user'));
            } else {
                user = _.omit(user._doc,['password','_id','__v']);
                resolve(user);
            }
        });
    })

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
                    let response = await  emailService.sendEmail({
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
    let userId = await utility.getUserIdFromToken(data.headers.token);
    if (userId) {
        return new Promise((resolve, reject) => {
            User.findOne({'_id': userId}, (err, user) => {
                if (err) {
                    reject(new Error('failed to changePassword'));
                } else {
                    user.password = bcrypt.hashSync(data.body.newPassword, 10);
                    user.lastUpdated = Date.now();
                    user.save((err, user2) => {
                        if (err) {
                            resolve(new Error('failed to changePassword'));
                        } else {
                            resolve('password changed successfully!');
                        }
                    });
                }
            })
        })
    } else {
        return Promise.resolve({auth: false, message: 'failed to authenticate token'});
    }
}