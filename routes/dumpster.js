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

module.exports = router;
