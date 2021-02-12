var express = require('express');
var router = express.Router();
const auth = require('../controllers/authController');
const config = require('../controllers/config');

/* GET map. */
router.get('/', auth.requireAuth, function (req, res) {
    let key = config.getAPIKey();
    res.render('routes', {API_KEY:key});
});

module.exports = router;
