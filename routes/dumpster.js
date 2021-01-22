var express = require('express');
var router = express.Router();
const auth = require('../controllers/authController');
const dumpster = require('../controllers/dumpsterController');

/* GET dumpseter . */
router.get('/:dumpsterId', auth.requireAuth, async function (req, res) {
    var d = await dumpster.getDumpsterInfo(req.params.dumpsterId);
    res.render('dumpster', {
        dumpster: d[0],
    });
});

router.get('/history/:dumpsterId', auth.requireAuth, async function (req, res) {
    var d = await dumpster.getDumpsterInfo(req.params.dumpsterId);
    let data = d.map(i => {
        return {
            y:i.FullnessLevel,
            x: new Date(i.Time),
        };
    });
    res.json(data);
});

module.exports = router;
