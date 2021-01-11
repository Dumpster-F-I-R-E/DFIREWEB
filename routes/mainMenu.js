var express = require('express');
var router = express.Router();
const auth = require('../controllers/authController');

router.get('/', auth.requireAuth, function (req, res) {
    console.log('Username is ' + res.locals.User.Role);
    res.render('mainMenu', {
        user: res.locals.User.Username,
        role: res.locals.User.Role,
    });
});

module.exports = router;
