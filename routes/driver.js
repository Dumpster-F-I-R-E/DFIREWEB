var express = require('express');
var router = express.Router();
const auth = require('../controllers/authController');
const driver = require('../controllers/driverController');
const config = require('../controllers/config');
const message = require('../controllers/messageController');
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

router.post(
    '/update-location',
    auth.requireAuth,
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
            errors.array().map((err) => {
                extractedErrors += err.param + ':' + err.msg + '<br>';
            });
            console.log(extractedErrors);
            return res.json({
                success: false,
                error: extractedErrors,
            });
        }
        await driver.setLocation(
            res.locals.User.UserID,
            data.Latitude,
            data.Longitude
        );
        res.json({
            success: true,
            error: 'Error Message',
        });
    }
);

router.get('/messages', auth.requireAuth, async function (req, res) {
    console.log('Checking messages');
    let result = await message.getMessages(res.locals.User.UserID);
    let numUnread = await message.getUnreadMessages(res.locals.User.UserID);
    console.log(result);
    await message.updateMessage(res.locals.User.UserID);
    res.render('driverMessages', {
        messages: result,
        unread: numUnread,
    });
});

router.get('/unreadMessages', auth.requireAuth, async function (req, res) {
    console.log('Checking unread messages');
    console.log(res.locals.User);
    //let result = await message.getMessages(res.locals.User.UserID);
    let numUnread = await message.getUnreadMessages(res.locals.User.UserID);
    console.log(numUnread);
    res.json({
        unread: numUnread,
    });
});

router.post('/sendAlert', auth.requireAuth, async function (req, res) {
    let data = req.body;
    let dumpsterID = req.body.Dumpster;
    console.log(dumpsterID);
    console.log(data);
    console.log(res.locals.User);
    let recvMessage = `An alert has been received for dumpster ${dumpsterID} by ${res.locals.User.Username}, please check the dumpster information`;
    let senderUpdate = `An alert has been sent to driver ${data.Driver}`;
    await message.sendAlerts(data.DriverID, recvMessage);
    await message.sendAlerts(res.locals.User.UserID, senderUpdate);

    res.json({
        success: true,
        error: 'Error Message',
    });
});

module.exports = router;
