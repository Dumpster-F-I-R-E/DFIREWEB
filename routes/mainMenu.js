var express = require('express');
var router = express.Router();
const auth = require('../controllers/authController');
var mmDLController = require('../controllers/mainMenuDumpsterListController');

router.get('/', auth.requireAuth, async function (req, res) {
    console.log('Username is ' + res.locals.User.Role);
    report = await mmDLController.getReports();
    console.log(report);
    // if(typeof(report) == "undefined") {
    //     console.log("true");
    //     report = "NULL";
    // }
    res.render('mainMenu', {
        user: res.locals.User.Username,
        role: res.locals.User.Role,
        dumpsterData: report
    });
});

module.exports = router;
