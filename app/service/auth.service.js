const User = require('../model/User');
const UserLogin = require('../model/UserLogin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const utility = require('./utility.service');

module.exports.getUserSession = async (token) => {
    let userId = await utility.getUserIdFromToken(token);
    if (userId) {
        return new Promise((resolve, reject) => {
            //PROJECTION => hiding password and id before sending it
            User.findById(userId, {password: 0, _id: 0}, (err, user) => {
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
    let userId = await utility.getUserIdFromToken(token);
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


module.exports.authenticateToken = async (req, res, next) => {
    let token = req.headers.token;

    //check if token exist in DB
    let ifTokenExist = await UserLogin.findOne({'token': token});
    if (ifTokenExist) {
        //authenticate token
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                //update token status
                let userLogin = new UserLogin(ifTokenExist);
                userLogin.status = false;
                userLogin.save((err, userLogin) => {
                    if (err) {
                        return res.status(500).json(
                            {
                                auth: false,
                                message: 'token expired!'
                            }
                        );
                    } else {
                        return res.status(200).json({
                            auth: false,
                            message: 'failed to authenticate with expired token!'
                        });
                    }
                });
            } else {
                return next();
            }
        });
    } else {
        return res.status(401).json({auth: false, message: 'invalid token.'});
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
                if (bcrypt.compareSync(userInfo.password, user.password)) {
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