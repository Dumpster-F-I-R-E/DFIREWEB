var express = require('express');
var router = express.Router();
const dumpster = require('../controllers/dumpsterController');
const auth = require('../controllers/authController');

/* GET dumpseter infor. */
// router.get('/dumpster/:dumpsterId', auth.requireAuth, function(req, res, next) {

// });

router.get('/dumpsters', auth.requireAuth, function (req, res) {
    res.json(dumpster.getDumpstersInfo());
});

module.exports = router;
