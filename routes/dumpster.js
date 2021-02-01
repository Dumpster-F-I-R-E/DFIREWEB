var express = require('express');
var router = express.Router();
const auth = require('../controllers/authController');
const dumpster = require('../controllers/dumpsterController');

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
        console.log(u);
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
    res.render('dumpster', {
        dumpster: d[0],
    });
});

router.get('/history/:dumpsterId', auth.requireAuth, async function (req, res) {
    var d = await dumpster.getDumpsterInfo(req.params.dumpsterId);
    let data = d.map((i) => {
        return {
            y: i.FullnessLevel,
            x: new Date(i.Time),
        };
    });
    res.json(data);
});



module.exports = router;
