var express = require('express');
var router = express.Router();
const auth = require('../controllers/authController');

router.get('/map', auth.requireAuth,function (req, res) {
    res.render('driverMap', {
        user: res.locals.User.Username,
        role: res.locals.User.Role,
    });
});

router.get('/navigation', auth.requireAuth,function (req, res) {

    res.render('navigation');
});

module.exports = router;