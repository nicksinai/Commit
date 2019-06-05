const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        requird: true,
        unique: true
    },
    active: {
        type: boolean,
        default: false
    },
    gym: {
        type: String
    },
    paymentInfo: {
        type: String
    },
    lastCheckin: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = User = mongoose.model('user', UserSchema);