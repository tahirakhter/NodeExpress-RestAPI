const mongoose = require('mongoose');

module.exports = mongoose.model('UserLogin', new mongoose.Schema({
        userId: {
            type: String,
            require: true
        },
        token: {
            type: String,
            required: true
        },
        deviceId: {
            type: String
        },
        lat: {
            type: String
        },
        long: {
            type: String
        },
        os: {
            type: String
        },
        ipAddress: {
            type: String
        },
        status: {
            type: Boolean,
            default: true,
            required: true
        }
    }, {
        timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
    })
)