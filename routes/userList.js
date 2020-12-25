var express = require('express');
var router = express.Router();
const auth = require('../controllers/authController');
const users = require('../controllers/userListController');

router.get('/', auth.requireAuth, async function (req, res) {
    let role = req.query.role;
    let name = req.query.name;
    let list = await users.getUsers(name, role);
    res.render('userList', {
        users: list,
        role: role,
        name: name,
    });
});

module.exports = router;
