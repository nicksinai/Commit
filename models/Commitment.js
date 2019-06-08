const mongoose = require('mongoose');

const CommitmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    days: {
        type: Number,
        required: true
    },
    weeks: {
        type: Number,
        required: true
    },
    gym: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    checkins: {
        type: Number,
        default: 0
    },
    lastSuccesfulCheckin: {
        type: Date,
        default: undefined
    }
});

module.exports = Commitment = mongoose.model('commitment', CommitmentSchema);
