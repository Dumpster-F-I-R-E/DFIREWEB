var express = require('express');
var router = express.Router();
var auth = require('../controllers/authController');

router.get('/login', async function (req, res) {
    const authToken = req.cookies['AuthToken'];
    let valid = await auth.isValidSession(authToken);
    if (valid) {
        res.redirect('/mainMenu');
    } else {
        res.render('login', { message: '' });
    }
    
});

router.post('/login', async function (req, res) {
    console.log(req.body);
    const { valid, authToken } = await auth.authenticate(
        req.body.username,
        req.body.password
    );
    console.log('valid', valid);
    if (valid) {
        res.cookie('AuthToken', authToken);
        res.redirect('/mainMenu');
    } else {
        res.render('login', { message: 'Please enter both id and password' });
    }
});

router.get('/logout', async function (req, res) {
    const authToken = req.cookies['AuthToken'];
    await auth.logout(authToken);
    res.redirect('/login');
});

module.exports = router;
