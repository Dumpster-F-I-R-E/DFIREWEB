var express = require('express');
var router = express.Router();
const auth = require('../controllers/authController');
const sensor = require('../controllers/dumpsterController');

router.get(
    '/',
    auth.requireAuth,
    auth.requireAdminOrManager,
    function (req, res) {
        res.render('addDumpster');
    }
);

router.post(
    '/',
    auth.requireAuth,
    auth.requireAdminOrManager,
    async function (req, res) {
        const data = req.body;
        let u = await sensor.addDumpster(res.locals.Sensor, data);
        let msg = '';
        let s = true;
        if (!u) {
            msg = "You don't have permission to create this dumpster.";
            s = false;
        }
        res.json({
            success: s,
            sensor: u,
            error: msg,
        });
    }
);

module.exports = router;
