const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const keys = require('../../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const { check, validationResult } = require('express-validator/check');
const User = require('../../models/User');
const auth = require('../../middleware/auth');

// @route   POST api/users
// @desc    Sign Up User
// @access  Public
router.post(
    '/',
    [
        check('name', 'Name is required')
            .not()
            .isEmpty(),
        check('email', 'Please include avalid email').isEmail(),
        check(
            'password',
            'Please enter a password with 8 or more characters'
        ).isLength({ min: 8 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        try {
            // Check if user exists
            let user = await User.findOne({ email });

            if (user) {
                return res.status(400).json({
                    errors: [{ msg: 'User already exists' }]
                });
            }

            user = new User({
                name,
                email,
                password
            });

            // Encrypt password
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 }, // Change back to 3600 for prod
                (err, token) => {
                    if (err) throw err;
                    return res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// @route   POST api/users/stripeID
// @desc    Add stripe customer ID to a User
// @access  Private
router.put('/stripeId', auth, async (req, res) => {
    // Obtain stripe token from client
    const token = req.body.stripeToken;

    try {
        // Obtain user from database
        let user = await User.findById(req.user.id);

        // Create stripe customer
        const customer = await stripe.customers.create({
            source: token,
            email: user.email
        });

        // Save stripe customer ID to User
        user.stripeId = customer.id;
        await user.save();

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
