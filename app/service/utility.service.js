const jwt = require('jsonwebtoken');

module.exports = {
    getUserIdFromToken: function (token) {
        if (!token) {
            return false;
        } else {
            return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    return false;
                } else {
                    return decoded.id;
                }
            });
        }
    }
}