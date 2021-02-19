var express = require('express');
var router = express.Router();
const auth = require('../controllers/authController');
const driver = require('../controllers/driverController');
const config = require('../controllers/config');
const { body, validationResult } = require('express-validator');

router.get('/map', auth.requireAuth, function (req, res) {
    let key = config.getAPIKey();
    res.render('driverMap', {
        user: res.locals.User.Username,
        role: res.locals.User.Role,
        API_KEY: key,
    });
});

router.get('/navigation', auth.requireAuth, function (req, res) {
    let key = config.getAPIKey();
    res.render('navigation', { API_KEY: key });
});

router.post('/update-location', auth.requireAuth,
    [
        body('Latitude').notEmpty().isNumeric(),
        body('Longitude').notEmpty().isNumeric(),
    ],
    async function (req, res) {
        console.log(req.body);
        let data = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let extractedErrors = '';
            errors.array().map(err => {
                extractedErrors += err.param + ':' + err.msg + '<br>';
            });
            console.log(extractedErrors);
            return res.json({
                success: false,
                error: extractedErrors
            });
        }
        await driver.setLocation(res.locals.User.UserID, data.Latitude, data.Longitude);
        res.json({
            success: true,
            error: 'Error Message'
        });
    });

module.exports = router;