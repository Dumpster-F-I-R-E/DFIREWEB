var express = require('express');
var router = express.Router();
const auth = require('../controllers/authController');
const mainMenuController = require('../controllers/mainMenuController');

router.get('/', auth.requireAuth, async function (req, res) {
    
    let data = await mainMenuController.getReports();
    res.render('report', {
        user: res.locals.User.Username,
        role: res.locals.User.Role,
        dumpsterData: data,
        title:'Reports'     
    });


});

router.get('/lowBattery', auth.requireAuth, async function (req, res) {
    
    let data = await mainMenuController.getLowBattery();
    res.render('report', {
        user: res.locals.User.Username,
        role: res.locals.User.Role,
        dumpsterData: data,
        title:'Low Battery'     
    });


});

router.get('/full', auth.requireAuth, async function (req, res) {
    
    let data = await mainMenuController.getFullDumpsters();
    res.render('report', {
        user: res.locals.User.Username,
        role: res.locals.User.Role,
        dumpsterData: data,
        title:'Full Dumpsters'     
    });


});


module.exports = router;