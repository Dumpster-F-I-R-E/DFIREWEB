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
    let s = true;
    if(!u){
        msg = 'You don\'t have permission to create this account';
        s = false;
    }
    res.json({
        success:s,
        user:u,
        error:msg
    });
});

router.post('/delete', auth.requireAuth, async function (req, res) {
    const data = req.body;
    await user.deleteUser(res.locals.User, data.UserID);
    let msg = '';
    res.json({
        success:true,
        error:msg
    });
});


module.exports = router;
