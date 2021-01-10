
const express = require('express');
const router = express.Router();
const passport = require('passport');
var passportConfig = require('../config/passport');

//setup configuration for facebook login
passportConfig();

const userController = require('../controllers/users');

router.route('/auth/facebook')
      .post(passport.authenticate('facebookToken', { session: false }), userController.facebookOAuth);

module.exports = router;

