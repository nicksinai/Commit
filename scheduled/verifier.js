const Commitment = require('../models/Commitment');
const User = require('../models/User');
const connectDB = require('../config/db');

// Connect Database
connectDB();

const verifier = async () => {
    try {
        // Get eligible commitmentss
        // // Weeks remaining && Deadline in past
        let now = new Date();
        now.setHours(0, 0, 0, 0);
        // Zero time so only considering date
        now.setHours(0, 0, 0, 0);
        const eligible = await Commitment.find({
            weeksRemaining: { $gt: 0 },
            nextDeadline: { $lte: now }
        });
        console.log(eligible);
        // Get chargeable commitments
        // // Checkins remaining > 0
        // Charge chargeable commitment's user
        // // Charge user's stripe customer ID
        // Update eligible commitments weeks remaining, checkins remaining, & next deadline
        // // Decrement weeks remaining by 1
        // // Set checkins remaining to commitment's 'days' value
        // // Increase nextDeadline by 7 days
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifier();
