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
        // Instead of keeping null, I'm initializing to some date in the past.
        // Prevents me from having to check if there is no last checkin,
        // I can always check if it was in the past or not.
        commitmentFields.checkins.lastSuccesfulCheckin = new Date(1995, 3, 3);

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

// @route   PUT api/commitment/checkin/history
// @desc    Add commitment checkin history
// @access  Private
router.put('/checkin/history', auth, async (req, res) => {
    // Build checkin history object

    try {
    } catch (err) {
        console.error(error.msg);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
