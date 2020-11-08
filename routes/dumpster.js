var express = require('express');
var router = express.Router();
const auth = require("../controllers/authController");

/* GET dumpseter . */
router.get('/:dumpsterId', auth.requireAuth, function(req, res, next) {
  res.render('dumpster');
});

module.exports = router;