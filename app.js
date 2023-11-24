const express                          = require('express')
const app                              = express()
const mongoose                         = require('mongoose')
const crypto                           = require('crypto');
const jwt                              = require('jsonwebtoken');
const bcrypt                           = require('bcrypt')
const { connectToDatabase, User, Url } = require('./models/db.js');

connectToDatabase()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post("/register", (req, res) => {
   
    // form data and password hashing variables
    const { email, password }  = req.body
    const saltRounds           = 10;
    const salt                 = bcrypt.genSaltSync(saltRounds);
    const PasswordHash         = bcrypt.hashSync(password, salt);

    // search if user exist else save data to db
    User.findOne({ email })

     .then( (result) => {
        if (result){
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



app.listen(3000)