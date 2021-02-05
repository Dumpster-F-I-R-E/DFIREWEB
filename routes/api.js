var express = require('express');
var router = express.Router();
const dumpster = require('../controllers/dumpsterController');
const auth = require('../controllers/authController');
const driver = require('../controllers/driverController');
/* GET dumpseter infor. */
// router.get('/dumpster/:dumpsterId', auth.requireAuth, function(req, res, next) {

// });

router.get('/dumpsters', auth.requireAuth, async function (req, res) {
    let data = await dumpster.getDumpstersInfo();
    res.json(data);
});

router.get('/drivers', auth.requireAuth, async function (req, res) {
    let data = await driver.getDrivers();
    res.json(data);
});

router.post('/assign-driver', async function (req, res) {
    console.log(req.body);
    let data = req.body;
    await driver.setDumpsters(data.DriverID, data.Dumpsters);
    res.json({
        success:true,
        error:'Error Message'
    });
});

router.get('/routes', auth.requireAuth, async function (req, res) {
    let data = await driver.getRoutes();
    res.json(data);
});

router.get('/my-route', auth.requireAuth, async function (req, res) {
    let data = await driver.getRoute(res.locals.User.UserID);
    res.json(data);
});

module.exports = router;
