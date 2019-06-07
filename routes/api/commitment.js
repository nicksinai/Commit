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
        const commitment = await Commitment.findOne({ user: req.body.id });
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
// @desc    Create or update user's commitment
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
    }
);

module.exports = router;
