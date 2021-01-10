const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
require('dotenv').config();
const router = express.Router();
const cors = require('cors');
const User = require('./models/user');

// mongoose connection defined as IIFE( immediately invoked function expression)
(async function () {
    try {
        await mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to mongodb successfully');
    } catch (error) {
        console.log('Error connecting to mongodb');
    }
})();

const app = express();

const corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// middleware for handling token
const authenticate = expressJwt({
    secret: process.env.EXPRESS_JWT_SECRET,
    algorithms: ['RS256'],
    requestProperty: 'auth',
    getToken: (req) => {
        if (req.headers['x-auth-token']) {
            return req.headers['x-auth-token'];
        }
        return null;
    }
});

const getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.auth.id);
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

const getSingle = (req, res) => {
    const user = req.user.toObject();
    delete user['facebook'];
    delete user['__v'];
    res.json(user);
};

app.use('/users', require('./routes/users'));

router.route('/auth/me')
    .get(authenticate, getCurrentUser, getSingle);

app.use('/api', router);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;
