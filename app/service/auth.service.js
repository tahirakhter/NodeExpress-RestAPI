const User = require('../model/User');
const UserLogin = require('../model/UserLogin');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const commonHelper = require('../helper/common.helper');
const _ = require('lodash');

module.exports.getUserSession = async (token) => {
    let userId =  await commonHelper.getUserIdFromToken(token);
    if (userId) {
        return new Promise((resolve, reject) => {
            //PROJECTION => hiding password and id before sending it
            User.findById(userId, {password: 0, _id: 0, __v: 0}, (err, user) => {
                if (err) {
                    reject(new Error('user not found!'));
                } else {
                    resolve(user);
                }
            })
        })
    } else {
        return Promise.resolve({auth: false, message: 'failed to authenticate token'});
    }
}


module.exports.logout = async (token) => {
    return new Promise((resolve, reject) => {
        UserLogin.deleteOne({'token': token}).then((response) => {
            if (response) {
                resolve({auth: false, token: null, message: 'logout successfully!'});
            } else {
                reject(new Error('Server Error Unable to Logout'));
            }
        })
    })
}


module.exports.logoutAllDevices = async (token) => {
    let userId = await commonHelper.getUserIdFromToken(token);
    if (userId) {
        return new Promise((resolve, reject) => {
            UserLogin.deleteMany({'userId': userId}).then((response) => {
                if (response) {
                    resolve({auth: false, token: null, message: 'all devices logout successfully!'});
                } else {
                    reject(new Error('server error unable to logout all devices'));
                }
            })
        })
    } else {
        return Promise.resolve({auth: false, message: 'failed to authenticate token'});
    }
}

module.exports.authenticateUser = async (data) => {
    let userInfo = new User(data.body);
    let os = data.headers['user-agent'];
    if (!userInfo.userName || !userInfo.password) {
        return Promise.resolve({auth: false, message: 'please pass all the required parameters'});
    }
    return new Promise((resolve, reject) => {
        User.findOne({'userName': userInfo.userName}, (err, user) => {
            if (err) {
                resolve({message: 'incorrect userName!'});
            } else {
                //creating hash from password to compare
                let hashedPassword = crypto.pbkdf2Sync(userInfo.password,
                    process.env.PASSWORD_SALT, 100, 64, `sha512`).toString(`hex`);

                if (_.isEqual(hashedPassword, user.password)) {
                    let token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
                        expiresIn: 3600 // expires in 1 hour
                    });
                    UserLogin.findOne({'userId': user._id, 'status': true, 'os': os}).then((response) => {
                        if (!response) {
                            let obj = {
                                userId: user._id.toString(),
                                token: token,
                                deviceAddress: '',
                                lat: '',
                                long: '',
                                os: os,
                                ipAddress: ''
                            }
                            let userLogin = new UserLogin(obj);
                            userLogin.save((err, userLogin) => {
                                if (err) {
                                    reject(new Error('login failed!'));
                                } else {
                                    resolve({auth: true, token: userLogin.token});
                                }
                            });
                        } else {
                            resolve({auth: true, token: response.token});
                        }
                    })

                } else {
                    resolve({message: 'incorrect password'});
                }
            }
        })
    })
}
