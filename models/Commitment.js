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
        remaining: {
            type: Number
        },
        lastSuccesfulCheckin: {
            type: Date
        },
        history: [
            {
                success: {
                    type: Boolean,
                    required: true
                },
                loction: {
                    type: String
                },
                created: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    }
});

module.exports = Commitment = mongoose.model('commitment', CommitmentSchema);
