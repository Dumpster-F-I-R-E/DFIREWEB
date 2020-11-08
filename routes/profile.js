var express = require('express');
var router = express.Router();
const auth = require("../controllers/authController");

/* GET profile page. */
router.get('/', auth.requireAuth, function(req, res, next) {
  res.render('profile');
});

module.exports = router;