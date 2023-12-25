const express = require('express');
const router = express.Router();
const passport = require('../passport/passport-config');
const crypto = require('crypto')
const bcrypt = require('bcrypt');
const { Url, User } = require('../models/db.js');
require('isomorphic-fetch')


router.get('/', (req, res) => {
  if (req.user) {

    fetch(`${req.protocol + '://' + req.get('host')}/api/list-url`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${req.user.key}`
      }
    })
      .then(response => response.json())
      .then(data => {
        res.render('index', { user: req.user.key, message: req.flash('message'), urls: data})
      })
  } else {
      res.render('index', { user: req.user, message: req.flash('message') });
  }
});

router.get('/user-key', (req, res) => {
  if (req.user) {
    res.json({ userKey: req.user.key });
  } else {
    res.json({ userKey: null });
  }
});

router.post('/register', (req, res, next) => {
  const { email, password } = req.body;
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const PasswordHash = bcrypt.hashSync(password, salt);

  User.findOne({ email })
    .then((result) => {
      if (result) {
        res.render('index', { error: 'Email is already used', user: req.user })
      } else {
        const newUser = new User({
          email: req.body.email,
          password: PasswordHash,
          key: crypto.randomBytes(16).toString('hex'),
        });
        newUser.save()
          .then(savedUser => {
            // Automatically log in the user after registration
            req.login(savedUser, (err) => {
              if (err) {
                return next(err);
              }
              res.redirect('/');
            });
          })
          .catch(err => {
            res.render('index', { error: 'Error saving user', user: req.user })
          });
      }
    })
    .catch(err => {
      res.render('index', { error: 'Error checking email availability', user: req.user })
    });
});


router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
  })
);

router.post('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    console.log('User logged out');
    res.redirect('/');
  });
});

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