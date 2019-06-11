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
    weeksRemaining: {
        type: Number,
        required: true
    },
    checkins: {
        remaining: {
            type: Number,
            required: true
        },
        lastSuccesfulCheckin: {
            type: Date,
            required: true
        },
        history: [
            {
                success: {
                    type: Boolean,
                    required: true
                },
                loction: {
                    type: String,
                    required: true
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
