var express = require('express');
var router = express.Router();
const auth = require('../controllers/authController');
var mainMenuController = require('../controllers/mainMenuController');
const driver = require('../controllers/driverController');

router.get('/', auth.requireAuth, async function (req, res) {
    console.log('Username is ' + res.locals.User.Role);
    let report = await mainMenuController.getReports();
    if (res.locals.User.Role == 'Driver') {
        report = await driver.getRoute(res.locals.User.UserID);
        console.log('Main Menu Controller', report);
        report = report.Dumpsters;
    }
    
    let battery = await mainMenuController.getLowBattery();
    let full = await mainMenuController.getFullDumpsters();
        
    res.render('mainMenu', {
        user: res.locals.User.Username,
        role: res.locals.User.Role,
        dumpsterData: report,
        battery: battery,
        full: full,
    });
});

module.exports = router;
