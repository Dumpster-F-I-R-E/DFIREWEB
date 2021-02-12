var express = require('express');
var router = express.Router();
const auth = require('../controllers/authController');
const driver = require('../controllers/driverController');
const config = require('../controllers/config');

router.get('/map', auth.requireAuth,function (req, res) {
    let key = config.getAPIKey();
    res.render('driverMap', {
        user: res.locals.User.Username,
        role: res.locals.User.Role,
        API_KEY: key,
    });
});

router.get('/navigation', auth.requireAuth,function (req, res) {
    let key = config.getAPIKey();
    res.render('navigation', {API_KEY:key});
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