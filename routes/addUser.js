var express = require('express');
var router = express.Router();
const auth = require('../controllers/authController');
const user = require('../controllers/userController');

router.get('/add', auth.requireAuth, function (req, res) {
    res.render('addUser');
});


router.post('/add', auth.requireAuth, async function (req, res) {
    const data = req.body;
    let u = await user.createUser(res.locals.User, data);
    let msg = '';
    res.json({
        success:true,
        user:u,
        error:msg
    });
});

module.exports = router;
