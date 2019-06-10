const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const Commitment = require('../../models/Commitment');
const User = require('../../models/User');

// @route   GET api/commitment/me
// @desc    Get current user's commitment
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const commitment = await Commitment.find({
            user: req.user.id,
            // TODO: Needs to get the active commitment (with weeks remaining > 0)
            weeks: { $gt: 10 }
        });
        if (!commitment) {
            return res
                .status(400)
                .json({ msg: 'There is no commitment for this user' });
        }
        res.json(commitment);
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
        // Initializing to some date in the past for new users so that
        // there are no collisions when they make their first checin
        // Also that's my birthday :)
        commitmentFields.checkins.lastSuccesfulCheckin = new Date(1995, 3, 3);

        try {
            // Update

            // let commitment = await Commitment.findOne({
            //     user: req.user.id
            // });

            // if (profile) {
            //     // Update
            //     profile = await Profile.findOneAndUpdate(
            //         { user: req.user.id },
            //         { $set: profileFields },
            //         { new: true }
            //     );

            //     return res.json(profile);
            // }

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

module.exports = router;
