var express = require('express');
var router = express.Router();
const auth = require("../controllers/authController");

/* GET map. */
router.get('/', auth.requireAuth, function(req, res, next) {
  res.render('map');
});

module.exports = router;
