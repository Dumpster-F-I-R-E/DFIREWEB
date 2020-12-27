var express = require('express');
var router = express.Router();
const auth = require('../controllers/authController');
const profile = require('../controllers/profileController');

/* GET profile page. */
router.get('/', auth.requireAuth, function (req, res) {
    res.render('profile');
});

router.get('/image/:id', auth.requireAuth, async function (req, res) {
    let userid = req.params.id;
    let data = await profile.getImage(userid);
    res.setHeader('Content-Length', data.length);
    res.write(data, 'binary');
    res.end();
});

module.exports = router;
