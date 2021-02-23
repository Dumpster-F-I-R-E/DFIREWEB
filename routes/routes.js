var express = require('express');
var router = express.Router();
const auth = require('../controllers/authController');
const config = require('../controllers/config');
const driver = require('../controllers/driverController');
/* GET map. */
router.get('/', auth.requireAuth, auth.requireManager, async function (req, res) {
    let key = config.getAPIKey();
    res.render('routes', {API_KEY:key});
});

router.get('/optimize', auth.requireAuth, auth.requireManager, async function (req, res) {
    let key = config.getAPIKey();
    await driver.optimizeRoutes();    
    res.render('routes', {API_KEY:key});
});

router.get('/clear', auth.requireAuth, auth.requireManager, async function (req, res) {
    let key = config.getAPIKey();
    await driver.clearRoutes();    
    res.render('routes', {API_KEY:key});
});

module.exports = router;
