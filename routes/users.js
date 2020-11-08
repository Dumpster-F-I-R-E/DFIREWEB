var express = require('express');
var router = express.Router();

/* GET User Management page. */
router.get('/', function(req, res, next) {
  res.render('user_list');
});

module.exports = router;