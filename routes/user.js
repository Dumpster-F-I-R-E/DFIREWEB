var express = require('express');
var router = express.Router();
const auth = require('../controllers/authController');
const user = require('../controllers/userController');
const { body, validationResult } = require('express-validator');


router.get(
    '/list',
    auth.requireAuth,
    auth.requireAdminOrManager,
    async function (req, res) {
        let role = req.query.role;
        let name = req.query.name;
        let list = await user.getUsers(name, role);
        res.render('userList', {
            users: list,
            role: role,
            name: name,
        });
    }
);

router.get(
    '/add',
    auth.requireAuth,
    auth.requireAdminOrManager,
    function (req, res) {
        res.render('addUser');
    }
);

router.post(
    '/add',
    auth.requireAuth,
    auth.requireAdminOrManager,
    [
        body('Username', 'Username is empty').notEmpty(),
        body('Email', 'Email is empty').notEmpty().isEmail().withMessage('Invalid Format'),
    ],
    async function (req, res) {
        const data = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let extractedErrors = '';
            errors.array().map(err => {
                extractedErrors += err.param + ':' + err.msg + '<br>';
            });
            console.log(extractedErrors);
            return res.json({
                success: false,
                error: extractedErrors
            });
        }
        let prevUser = await user.getUser(data.Username);
        console.log('prev_user', prevUser);
        if (prevUser) {
            return res.json({
                success: false,
                user: null,
                error: 'Username is not available. Please choose another!.',
            });
            
        }
        let u = await user.createUser(res.locals.User, data);
        let msg = '';
        let s = true;
        if (!u) {
            msg = "You don't have permission to create this account";
            s = false;
        }
        res.json({
            success: s,
            user: u,
            error: msg,
        });
    }
);

router.post(
    '/delete',
    auth.requireAuth,
    auth.requireAdminOrManager,
    [
        body('UserID').notEmpty().isNumeric(),
    ],
    async function (req, res) {
        const data = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let extractedErrors = '';
            errors.array().map(err => {
                extractedErrors += err.param + ':' + err.msg + '<br>';
            });
            console.log(extractedErrors);
            return res.json({
                success: false,
                error: extractedErrors
            });
        }
        await user.deleteUser(res.locals.User, data.UserID);
        let msg = '';
        res.json({
            success: true,
            error: msg,
        });
    }
);

module.exports = router;
