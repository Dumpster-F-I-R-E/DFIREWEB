var express = require('express');
var router = express.Router();
const dumpster = require('../controllers/dumpsterController');
const auth = require('../controllers/authController');
const driver = require('../controllers/driverController');
const depot = require('../controllers/depotController');
const { body, validationResult } = require('express-validator');

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

router.get('/depots', auth.requireAuth, async function (req, res) {
    let data = await depot.getAllDepots();
    res.json(data);
});

router.post('/assign-driver', auth.requireAuth, auth.requireManager, 
    [
        body('DriverID').notEmpty().isNumeric(),
        body('Dumpsters').isArray(),
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
        await driver.setDumpsters(data.DriverID, data.Dumpsters);
        res.json({
            success: true,
            error: 'Error Message'
        });
    });


router.post('/clear-driver', auth.requireAuth, auth.requireManager,
    [
        body('DriverID').notEmpty().isNumeric(),
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
        await driver.clearDumpsters(data.DriverID);
        res.json({
            success: true,
            error: 'Error Message'
        });
    });




router.get('/routes', auth.requireAuth, auth.requireManager, async function (req, res) {
    let data = await driver.getRoutes();
    res.json(data);
});

router.get('/my-route', auth.requireAuth, async function (req, res) {
    let data = await driver.getRoute(res.locals.User.UserID);
    res.json(data);
});


module.exports = router;
