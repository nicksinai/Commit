const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const Commitment = require('../../models/Commitment');
const User = require('../../models/User');

// @route   GET api/commitment/me
// @desc    Get current user's active commitment
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        // Get all of a user's commitments
        const commitments = await Commitment.find({ user: req.user.id }).sort(
            '-created'
        );
        // Get the active commitment
        if (commitments.length == 0 || commitments[0].weeksRemaining < 1) {
            // User has no commitments or no active commitments
            return res
                .status(400)
                .json({ msg: 'There is no active commitment for this user' });
        }
        res.json(commitments[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/commitment
// @desc    Create a new user commitment
// @access  Private
router.post(
    '/',
    [
        auth,
        [
            check('days', 'Days is required')
                .not()
                .isEmpty(),
            check('weeks', 'Weeks is required')
                .not()
                .isEmpty(),
            check('gym', 'Gym is required')
                .not()
                .isEmpty(),
            check('price', 'Price is required')
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Destructure the request
        const { days, weeks, gym, price } = req.body;

        // Build commitment object
        const commitmentFields = {};
        commitmentFields.user = req.user.id;
        if (days) commitmentFields.days = days;
        if (weeks) commitmentFields.weeks = weeks;
        if (gym) commitmentFields.gym = gym;
        if (price) commitmentFields.price = price;
        commitmentFields.weeksRemaining = weeks;

        // Build checkins object
        commitmentFields.checkins = {};
        commitmentFields.checkins.remaining = days;

        try {
            // Create
            commitment = new Commitment(commitmentFields);

            await commitment.save();
            res.json(commitment);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route   PUT api/commitment/checkin
// @desc    Verify checkin and update commitment
// @access  Private
// @note    This could do with a refactor to separate concerns
router.put('/checkin/history', auth, async (req, res) => {
    // Bring in user's commitment
    // Handle if user has already had a successful checkin today
    // Handle if location doesn't match user's gym
    // Decrement checkins remaining
    // Update checkin history
    // Save

    // Obtain user's location from request body
    const location = req.body.location;

    // Determine if location matches commitment gym
    let commitment;
    let success;
    try {
        commitment = await Commitment.findOne({ user: req.user.id });

        // Compare locations and update commitment accordingly
        if (location == commitment.gym) {
            // Match: decrement remaining checkins
            success = true;
        } else success = false;
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

    // Build checkin object
    const newCheckin = {
        success,
        location
    };

    // Save checkin to checkin history
    try {
        commitment.checkins.history.unshift(newCheckin);

        await commitment.save();

        res.json(commitment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
