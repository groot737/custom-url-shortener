const express = require('express')
const app = express()
const mongoose = require('mongoose')
const crypto = require('crypto');
const bcrypt = require('bcrypt')
const { connectToDatabase, User, Url } = require('./models/db.js');


connectToDatabase()
app.set('view engine', 'ejs')
app.use(express.static('./views'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.post("/register", (req, res) => {

    // form data and password hashing variables
    const { email, password } = req.body
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const PasswordHash = bcrypt.hashSync(password, salt);

    // search if user exist else save data to db
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


app.post('/short-url', (req, res) => {
    const { url } = req.body;
    const hash = crypto.createHash('sha256').update(url).digest('base64');
    const filteredHash = hash.replace(/\//g, '_').replace(/\+/g, '-');
    const shortIdentifier = filteredHash.substring(0, 6);
    const userId = "6561ad3ce984e35d1756318d";
    const short_url = 'localhost:3000/' + shortIdentifier;

    const newUrl = new Url({
        userId: userId,
        key: shortIdentifier,
        long_url: url,
        short_url: short_url
    });

    Url.findOne({ long_url: url })
        .then((result) => {
            if (result) {
                res.json({ message: "URL is already used", url: result.short_url });
            } else {
                newUrl.save()
                    .then(() => {
                        // Update the User document to include the reference to the new Url document
                        return User.findByIdAndUpdate(userId, { $push: { urls: newUrl._id } }, { new: true });
                    })
                    .then((updatedUser) => {
                        res.status(200).json({ message: "Data saved successfully", url: short_url });
                    })
                    .catch((err) => {
                        res.status(500).json("Internal server error");
                    });
            }
        })
        .catch((err) => {
            res.status(500).json("Internal server error");
        });
});

app.get('/list-url', (req, res) => {
    const userId = "6561ad3ce984e35d1756318d";
    let links = [];

    User.findById(userId)
        .then((result) => {
            if (result) {
                const urlPromises = result.urls.map(element => Url.findById(element));

                Promise.all(urlPromises)
                    .then(results => {
                        results.forEach(result => {
                            if (result) {
                                links.push(result.short_url);
                            }
                        });
                        res.status(200).json(links);
                    })
                    .catch(err => {
                        res.status(500).json("An error occurred.");
                    });
            } else {
                res.status(500).json("Data not found.");
            }
        })
        .catch(err => {
            res.status(500).json("An error occurred.");
        });
});

app.delete('/url/:id', (req, res) => {
    const urlId = req.params.id;
    const userId = "6561ad3ce984e35d1756318d";
    Url.findOneAndDelete({ _id: urlId })
        .then(() => {
            User.findByIdAndUpdate(userId, { $pull: { urls: urlId } }, { new: true })
                .then((updatedUser) => {
                    if (!updatedUser) {
                        return res.status(404).json({ message: "User not found" });
                    }
                    res.status(200).json({ deleted: true });
                })
                .catch((err) => {
                    res.status(500).json("Internal server error");
                });
        })
        .catch(err => {
            res.status(500).json("Error")
        })
});

app.get('/:key', (req, res) => {

    const key = req.params.key;
    Url.findOne({ key })
        .then((result) => {
            if (result) {
                res.redirect(result["long_url"])
            } else {
                res.status(404).json({ error: 'URL not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Internal server error' });
        });
})

app.listen(3000)