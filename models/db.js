const mongoose  = require('mongoose');
const User      = require('./User');
const Url       = require('./Url');
require('dotenv').config()

async function connectToDatabase() {
  try {
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;
    const connectionString = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.jtgxumq.mongodb.net/?retryWrites=true&w=majority`;

    await mongoose.connect(connectionString);

    console.log('Connected to MongoDB');

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

module.exports = { connectToDatabase, User, Url };
