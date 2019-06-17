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
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
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
        lastSuccessfulCheckin: {
            type: Date,
            required: true
        },
        history: [
            {
                success: {
                    type: Boolean,
                    required: true
                },
                location: {
                    lat: {
                        type: Number,
                        required: true
                    },
                    lng: {
                        type: Number,
                        required: true
                    }
                },
                created: {
                    type: Date,
                    required: true
                }
            }
        ]
    }
});

module.exports = Commitment = mongoose.model('commitment', CommitmentSchema);
