var express = require('express');
var router = express.Router();
const auth = require("../controllers/authController");
const dumpster = require("../controllers/dumpsterController");

/* GET dumpseter . */
router.get('/:dumpsterId', auth.requireAuth, function(req, res, next) {
  var d = dumpster.getDumpsterInfo(req.params.dumpsterId);
  res.render('dumpster', {
    dumpster : d
  });
});

module.exports = router;