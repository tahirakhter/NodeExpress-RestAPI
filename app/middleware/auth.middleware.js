const UserLogin = require('../model/UserLogin');
const jwt = require('jsonwebtoken');

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