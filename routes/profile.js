var express = require('express');
var router = express.Router();
const auth = require('../controllers/authController');
const profile = require('../controllers/profileController');
const notifications = require('../controllers/notifications');
const { body, check, validationResult } = require('express-validator');


/* GET profile page. */
router.get('/', auth.requireAuth, async function (req, res) {
    const authToken = req.cookies['AuthToken'];
    let p = await profile.getProfileInfo(authToken);
    if (!p) {
        p = {
            UserID: 'UserID',
            Role: res.locals.User.Role,
            FirstName: 'Fist Name',
            LastName: 'Last Name',
            Address: '24 Ave Calgary, AB',
            Email: 'admin@abc.com',
            Phone: '403-343-3434',
            StaffID: 'Staff ID',
        };
    }
    console.log('Staff ID', p.StaffID);
    res.render('profile', {
        profile: p,
        role: res.locals.User.Role,
    });
});


router.post('/', auth.requireAuth,
    [
        body('UserID').notEmpty().isNumeric(),
        body('Email').isEmail(),
        body('Phone').isMobilePhone(),
    ],
    async function (req, res) {
        const data = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let extractedErrors = '';
            errors.array().map(err => {
                extractedErrors += err.param + ':' + err.msg +'<br>';
            });
            console.log(extractedErrors);
            return res.json({
                success: false,
                error: extractedErrors
            });
        }
        await profile.updateProfile(res.locals.User, data);
        notifications.notifyUpdateProfile(req.body.Email, req.body.FirstName);
        return res.json({
            success: true
        });
    });

router.get(
    '/id/:id',
    auth.requireAuth,
    auth.requireAdmin,
    [
        check('id').isNumeric().withMessage('UseID should be a number'),
    ],
    async function (req, res) {
        let id = req.params.id;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let extractedErrors = '';
            errors.array().map(err => {
                extractedErrors += err.param + ':' + err.msg +'<br>';
            });
            console.log(extractedErrors);
            return res.status(404).json({
                success: false,
                error: extractedErrors
            });
        }

        let p = await profile.getProfileById(id);
        if (!p) {
            return res.redirect('/user/list');
        }
        res.render('profile', {
            profile: p,
        });
    }
);


router.post('/change-password', auth.requireAuth,
    [
        body('Password', 'Password is empty').notEmpty(),
        body('UserID').notEmpty().isNumeric(),
    ],
    async function (req, res) {
        const data = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {

            let extractedErrors = '';
            errors.array().map(err => {
                extractedErrors += err.param + ':' + err.msg +'<br>';
            });
            console.log(extractedErrors);
            return res.json({
                success: false,
                error: extractedErrors
            });
        }
        await profile.changePassword(res.locals.User, data.UserID, data.Password);
        let result = await profile.getUser(data.UserID);
        notifications.notifyChangePassword(result.Email, result.FirstName);
        return res.json({
            success: true,
            error: []
        });
    });

router.get('/image/:id', auth.requireAuth,
    [
        check('id').isNumeric().withMessage('UseID should be a number'),
    ],
    async function (req, res) {
        let userid = req.params.id;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let extractedErrors = '';
            errors.array().map(err => {
                extractedErrors += err.param + ':' + err.msg +'<br>';
            });
            console.log(extractedErrors);
            return res.status(404).json({
                success: false,
                error: extractedErrors
            });
        }

        let data = await profile.getImage(userid);
        // console.log(data);
        res.setHeader('Content-Length', data.length);
        res.write(data, 'binary');
        res.end();
    });

router.post('/upload-photo', auth.requireAuth,
    [
        body('UserID').notEmpty().isNumeric(),
    ],
    async function (req, res) {
        const data = req.body;
        console.log('Uploading Photo...', req.body.UserID);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let extractedErrors = '';
            errors.array().map(err => {
                extractedErrors += err.param + ':' + err.msg +'<br>';
            });
            console.log(extractedErrors);
            return res.json({
                success: false,
                error: extractedErrors
            });
        }
        await profile.changeImage(res.locals.User, data.UserID, data.Image);

        res.json({ success: true });
    });

module.exports = router;
