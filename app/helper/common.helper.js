'user strict';
const _ = require('lodash');
const moment = require('moment');
const jwt = require('jsonwebtoken');

class CommonHelper {

    static getUserIdFromToken(token) {
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

    static getDateDiff(fromDate) {
        let now = moment();
        let from = moment(fromDate);
        let ms = now.diff(from);
        let d = moment.duration(ms);
        return Math.floor(d.asMinutes());
    }

    static getSeconds(type) {
        let seconds;
        switch (type) {
            case 'DAY':
                seconds = 60 * 60 * 24;
                break;
            case 'HOUR':
                seconds = 60 * 60;
                break;
            case 'MINUTE':
                seconds = 60;
                break;
            case 'SECOND':
                seconds = 1;
                break;
            default:
                seconds = 1;
                break;
        }
        return seconds;
    }

}

module.exports = CommonHelper;
