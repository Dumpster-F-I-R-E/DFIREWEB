var express = require('express');
var router = express.Router();
const auth = require('../controllers/authController');
const dumpster = require('../controllers/dumpsterController');
const driverController = require('../controllers/driverController');
const config = require('../controllers/config');
const { body, check, oneOf, validationResult } = require('express-validator');
const error = require('../controllers/error');

router.get(
    '/list',
    auth.requireAuth,
    auth.requireAdminOrManager,
    oneOf([
        check('dumpsterserialnumber').isNumeric(),
        check('dumpsterserialnumber').isEmpty(),
    ]),
    async function (req, res) {
        let DumpsterSerialNumber = req.query.dumpsterserialnumber;
        console.log(DumpsterSerialNumber);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let extractedErrors = '';
            errors.array().map((err) => {
                extractedErrors += err.param + ':' + err.msg + '<br>';
            });
            console.log(extractedErrors);
            return error.redirect(res, '/dumpster/list', extractedErrors);
        }
        let list = await dumpster.getDumpsters(DumpsterSerialNumber);
        res.render('dumpsterList', {
            dumpsters: list,
            dumpsterserialnumber: DumpsterSerialNumber,
        });
    }
);

router.get(
    '/add',
    auth.requireAuth,
    auth.requireAdminOrManager,
    function (req, res) {
        res.render('addDumpster');
    }
);

router.post(
    '/add',
    auth.requireAuth,
    auth.requireAdminOrManager,
    [
        body('DumpsterSerialNumber').notEmpty().isNumeric(),
        body('CompanyID').notEmpty().isNumeric(),
    ],
    async function (req, res) {
        const data = req.body;
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
        let u = await dumpster.createDumpster(data);
        let msg = '';
        let s = true;
        if (!u) {
            msg = "You don't have permission to create this dumpster.";
            s = false;
        }
        res.json({
            success: s,
            dumpster: u,
            error: msg,
        });
    }
);

router.post(
    '/delete',
    auth.requireAuth,
    auth.requireAdminOrManager,
    [body('DumpsterID').notEmpty().isNumeric()],
    async function (req, res) {
        const data = req.body;
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
        let u = await dumpster.deleteDumpster(data.DumpsterID);
        let msg = '';
        return res.json({
            success: true,
            dumpster: u,
            error: msg,
        });
    }
);

/* GET map. */
router.get(
    '/map',
    auth.requireAuth,
    auth.requireManagerOrDriver,
    function (req, res) {
        let key = config.getAPIKey();
        res.render('dumpsterMap', { API_KEY: key });
    }
);

/* GET dumpster . */

router.get(
    '/:dumpsterId',
    auth.requireAuth,
    [check('dumpsterId').notEmpty().isNumeric()],
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let extractedErrors = '';
            errors.array().map((err) => {
                extractedErrors += err.param + ':' + err.msg + '<br>';
            });
            console.log(extractedErrors);
            return error.redirect(res, '/dumpster/list', extractedErrors);
        }
        var d = await dumpster.getDumpsterInfo(req.params.dumpsterId);
        let drv = await driverController.getDriver(req.params.dumpsterId);
        let pickups = await driverController.getPickups(req.params.dumpsterId);
        if (!d) {
            return error.redirect(
                res,
                '/dumpster/list',
                "Dumpster doesn't exist or is not activated"
            );
        } else {
            res.render('dumpster', {
                dumpster: d[0],
                driver: drv,
                pickups: pickups
            });
        }
    }
);

router.get(
    '/history/:dumpsterId',
    auth.requireAuth,
    [check('dumpsterId').notEmpty().isNumeric()],
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let extractedErrors = '';
            errors.array().map((err) => {
                extractedErrors += err.param + ':' + err.msg + '<br>';
            });
            console.log(extractedErrors);
            return res.status(422).json({
                success: false,
                error: extractedErrors,
            });
        }
        var d = await dumpster.getDumpsterInfo(req.params.dumpsterId);
        let forcast = dumpster.forcast(d);
        d.reverse();
        let data = d.map((i) => {
            return {
                y: i.FullnessLevel,
                x: i.ReportID,
                label: new Date(i.Time),
            };
        });
        res.json({
            data: data,
            forcast: forcast,
        });
    }
);

router.get(
    '/remove/:dumpsterId',
    auth.requireAuth,
    auth.requireManager,
    [check('dumpsterId').notEmpty().isNumeric()],
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let extractedErrors = '';
            errors.array().map((err) => {
                extractedErrors += err.param + ':' + err.msg + '<br>';
            });
            console.log(extractedErrors);
            return res.status(422).json({
                success: false,
                error: extractedErrors,
            });
        }
        var dumpsterID = req.params.dumpsterId;
        await dumpster.removeAssignedDriverFromDumpster(req.params.dumpsterId);
        var d = await dumpster.getDumpsterInfo(req.params.dumpsterId);
        let drv = await driverController.getDriver(req.params.dumpsterId);
        if (!d) {
            res.redirect('/dumpster/list');
        } else {
            res.redirect('/dumpster/' + dumpsterID);
        }
    }
);

module.exports = router;
