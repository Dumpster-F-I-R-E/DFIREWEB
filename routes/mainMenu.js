var express = require('express');
var router = express.Router();
const auth = require('../controllers/authController');

router.get('/', auth.requireAuth, function (req, res) {
    res.render('mainMenu');
});

module.exports = router;
