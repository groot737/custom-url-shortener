const express       = require('express');
const router        = express.Router();
const passport      = require('../passport/passport-config'); 
const User          = require('../models/db'); 
const bcrypt        = require('bcrypt');
const {Url } = require('../models/db.js');


router.get('/dashboard', (req, res) => {

    if (req.isAuthenticated()) {

        res.render('dashboard', { user: req.user });
    } else {

        res.redirect('/login');
    }
});

router.post("/register", (req, res) => {


    const { email, password } = req.body
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const PasswordHash = bcrypt.hashSync(password, salt);


    User.findOne({ email })

        .then((result) => {
            if (result) {
                res.status(400).json("Email is already used")
            } else {
                const newUser = new User({
                    email: req.body.email,
                    password: PasswordHash,
                    key: crypto.randomBytes(16).toString('hex')
                });
                newUser.save()
                    .then(savedUser => {
                        res.status(200).json("data saved succesfully!")
                    })
            }

        })
})

router.get('/login', (req, res) => {

    if (req.isAuthenticated()) {

        console.log(req.user)
        res.redirect('/dashboard');
    } else {

        res.render('login', { message: req.query.message });
    }
})

router.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
    })
);

router.get('/link/:key', async (req, res) => {
    const key = req.params.key;

    try {
        const result = await Url.findOne({ key });

        if (result) {
            res.redirect(result.long_url);
        } else {
            res.status(404).json({ error: 'URL not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
