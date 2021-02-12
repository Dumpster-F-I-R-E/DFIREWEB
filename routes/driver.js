var express = require('express');
var router = express.Router();
const auth = require('../controllers/authController');
const driver = require('../controllers/driverController');

router.get('/map', auth.requireAuth,function (req, res) {
    res.render('driverMap', {
        user: res.locals.User.Username,
        role: res.locals.User.Role,
    });
});

router.get('/navigation', auth.requireAuth,function (req, res) {

    res.render('navigation');
});

router.post('/update-location', auth.requireAuth, async function (req, res) {
    console.log(req.body);
    let data = req.body;
    await driver.setLocation(res.locals.User.UserID, data.Latitude, data.Longitude);
    res.json({
        success:true,
        error:'Error Message'
    });
});

module.exports = router;