const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const Commitment = require('../../models/Commitment');
const geometry = require('spherical-geometry-js');

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

        // Create nextDeadline and add
        let now = new Date();
        now.setHours(0, 0, 0, 0);
        commitmentFields.nextDeadline = new Date(
            now.setDate(now.getDate() + 7)
        );

        // Build checkins object
        commitmentFields.checkins = {};
        commitmentFields.checkins.remaining = days;
        commitmentFields.checkins.lastSuccessfulCheckin = new Date(1995, 3, 3);

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
router.put('/checkin/history', auth, async (req, res) => {
    // Get user's active commitment
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

        // Handle if user has already had a successful checkin today
        const lastSuccessfulCheckin =
            commitments[0].checkins.lastSuccessfulCheckin;

        let now = new Date();
        // Zero time so only considering date
        now.setHours(0, 0, 0, 0);

        if (lastSuccessfulCheckin.getTime() === now.getTime()) {
            // User has already had a successful checkin today
            return res.status(403).json({
                msg: 'Only one successful checkin per day is allowed'
            });
        }

        // Handle if location doesn't match user's gym
        // Get gym coords from DB
        const gymLatLng = new geometry.LatLng(
            commitments[0].gym.lat,
            commitments[0].gym.lng
        );

        // Get current coords from client
        const curLatLng = new geometry.LatLng(req.body.lat, req.body.lng);

        // Calculate distance between user's location and their gym
        const distance = geometry.computeDistanceBetween(curLatLng, gymLatLng);

        // Set accuracy allowance in meters
        const ACCURACY_ALLOWANCE = 50;

        // Determine if user is close enough to gym to checkin
        if (distance > ACCURACY_ALLOWANCE) {
            // User is greater than the accuracy allowance from gym (in meters)
            return res.status(403).json({
                msg: 'Current location is too far from commitment gym'
            });
        }

        // Decrement checkins remaining & set lastSuccessfulCheckin
        commitments[0].checkins.remaining -= 1;
        commitments[0].checkins.lastSuccessfulCheckin = now;

        // // Update checkin history
        // Build checkin object
        const newCheckinHistory = {
            success: true,
            location: {
                lat: req.body.lat,
                lng: req.body.lng
            },
            created: Date.now()
        };

        commitments[0].checkins.history.unshift(newCheckinHistory);

        // Save
        await commitments[0].save();

        res.json(commitments[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/commitment/geometryTest
// @desc    Test the spherical-geometry-js library
// @access  Private
router.post('/geometryTest', auth, async (req, res) => {
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

        // Get gym coords from DB
        const gymLatLng = new geometry.LatLng(
            commitments[0].gym.lat,
            commitments[0].gym.lng
        );
        // Get current coords from client
        const curLatLng = new geometry.LatLng(req.body.lat, req.body.lng);
        // Compare coords
        // Respond
        res.json(geometry.computeDistanceBetween(curLatLng, gymLatLng));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
