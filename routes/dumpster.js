var express = require('express');
var router = express.Router();
const auth = require('../controllers/authController');
const dumpster = require('../controllers/dumpsterController');
const driverController = require('../controllers/driverController');

router.get(
    '/list',
    auth.requireAuth,
    auth.requireAdminOrManager,
    async function (req, res) {
        let SensorSerialNumber = req.query.sensorserialnumber;
        let list = await dumpster.getDumpsters(SensorSerialNumber);
        res.render('dumpsterList', {
            dumpsters: list,
            sensorserialnumber: SensorSerialNumber
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
    async function (req, res) {
        const data = req.body;
        let u = await dumpster.addDumpster(res.locals.Dumpster, data);
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

/* GET map. */
router.get('/map', auth.requireAuth, function (req, res) {
    res.render('dumpsterMap');
});



/* GET dumpster . */
router.get('/:dumpsterId', auth.requireAuth, async function (req, res) {
    var d = await dumpster.getDumpsterInfo(req.params.dumpsterId);
    let drv = await driverController.getDriver(req.params.dumpsterId);
    if(!d){
        res.redirect('/dumpster/list');
    }else{
        res.render('dumpster', {
            dumpster: d[0],
            driver: drv
        });
    }
    
});

router.get('/history/:dumpsterId', auth.requireAuth, async function (req, res) {
    var d = await dumpster.getDumpsterInfo(req.params.dumpsterId);
    d.reverse();
    let data = d.map((i) => {
        return {
            y: i.FullnessLevel,
            x: i.ReportID,
            label: new Date(i.Time),
        };
    });
    res.json(data);
});



module.exports = router;
