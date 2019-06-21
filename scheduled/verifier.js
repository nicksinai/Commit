const Commitment = require('../models/Commitment');
const User = require('../models/User');
const db = require('../config/db');
const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);

// Funcs
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

        // Chsrge if checkins remaining > 0
        await chargeIncompleteWeeks(eligible);

        // Update eligible commitments weeks remaining, checkins remaining, & next deadline
        // // Decrement weeks remaining by 1
        // // Set checkins remaining to commitment's 'days' value
        // // Increase nextDeadline by 7 days
    } catch (err) {
        console.error(err);
        process.exit(1);
    } finally {
        process.exit(0);
    }
};

// Charge users with remaining checkins
const chargeIncompleteWeeks = async eligible => {
    await Promise.all(
        eligible.map(async commitment => {
            if (commitment.checkins.remaining > 0) {
                // Get user
                const user = await User.findById(commitment.user);

                // Charge user
                const charge = await stripe.charges.create({
                    amount: commitment.price,
                    currency: 'usd',
                    customer: user.stripeId,
                    receipt_email: user.email
                });
            }
        })
    );
};

// Main
console.log('Starting Verifier...');
db.connectDB();
verifier();
