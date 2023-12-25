const express                           = require('express')
const app                               = express()
const mongoose                          = require('mongoose')
const bcrypt                            = require('bcrypt')
const { connectToDatabase, User, Url }  = require('./models/db.js');
const path                              = require('path')
const session                           = require('express-session');
const passport                          = require('./passport/passport-config');
const mainRoute                         = require('./routes/webapp-route')
const apiRoute                          = require('./routes/api-route')
const { specs, swaggerUi }              = require('./swagger/swagger');
const flash                             = require('express-flash'); 

connectToDatabase();
app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: false,
    })
);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());
app.use('/', mainRoute);
app.use('/api', apiRoute);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(3000)