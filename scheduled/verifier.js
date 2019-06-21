const Commitment = require('../models/Commitment');
const User = require('../models/User');
const db = require('../config/db');

// Connect Database
console.log('Connecting Verifier...');
db.connectDB();

const verifier = async () => {
    try {
        // Get eligible commitmentss
        // // Weeks remaining && Deadline in past
        let now = new Date();
        now.setHours(0, 0, 0, 0);
        const eligible = await Commitment.find({
            weeksRemaining: { $gt: 0 },
            nextDeadline: { $lte: now }
        });

        eligible.forEach(commitment => {
            // Get chargeable commitments
            // // Checkins remaining > 0
            if (commitment.checkins.remaining > 0) {
                // Charge user's stripe customer ID
                
                console.log(commitment.user);
            }

            // Update eligible commitments weeks remaining, checkins remaining, & next deadline
            // // Decrement weeks remaining by 1
            // // Set checkins remaining to commitment's 'days' value
            // // Increase nextDeadline by 7 days
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    } finally {
        process.exit(0);
    }
};

verifier();
