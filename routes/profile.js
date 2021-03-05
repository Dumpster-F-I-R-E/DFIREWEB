var express = require('express');
var router = express.Router();
const auth = require('../controllers/authController');
const profile = require('../controllers/profileController');
const notifications = require('../controllers/notifications');
const { body, check, validationResult } = require('express-validator');
const error = require('../controllers/error');

/* GET profile page. */
router.get('/', auth.requireAuth, async function (req, res) {
    const authToken = req.cookies['AuthToken'];
    let p = await profile.getProfileInfo(authToken);
    if (!p) {
        p = {
            UserID: 'UserID',
            Role: res.locals.User.Role,
            FirstName: 'First Name',
            LastName: 'Last Name',
            Address: '24 Ave Calgary, AB',
            Email: 'admin@abc.com',
            Phone: '403-343-3434',
            StaffID: 'Staff ID',
        };
    }
    console.log('Staff ID', p.StaffID);
    let num = await profile.getNumberOfAssignedDumpsterForUserId(p.UserID);
    res.render('profile', {
        profile: p,
        role: res.locals.User.Role,
        DumpsterCount: num.DumpsterCount,
    });
});

router.post(
    '/',
    auth.requireAuth,
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
            errors.array().map((err) => {
                extractedErrors += err.param + ':' + err.msg + '<br>';
            });
            console.log(extractedErrors);
            return res.json({
                success: false,
                error: extractedErrors,
            });
        }
        let results = await profile.updateProfile(res.locals.User, data);
        if (results) {
            notifications.notifyUpdateProfile(
                req.body.Email,
                req.body.FirstName
            );
            return res.json({
                success: true,
            });
        } else {
            return res.json({
                success: false,
                error: 'Insufficient Permissions',
            });
        }
    }
);

router.get(
    '/id/:id',
    auth.requireAuth,
    auth.requireAdminOrManager,
    [check('id').isNumeric().withMessage('UserID should be a number')],
    async function (req, res) {
        let id = req.params.id;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let extractedErrors = '';
            errors.array().map((err) => {
                extractedErrors += err.param + ':' + err.msg + '<br>';
            });
            console.log(extractedErrors);
            return error.redirect(res, '/user/list', extractedErrors);
        }

        let p = await profile.getProfileById(id);
        let num = await profile.getNumberOfAssignedDumpsterForUserId(id);
        if (!p) {
            return error.redirect(res, '/user/list', "Profile doesn't exist");
        }
        res.render('profile', {
            profile: p,
            DumpsterCount: num.DumpsterCount,
        });
    }
);

router.post(
    '/change-password',
    auth.requireAuth,
    [
        body('Password', 'Password is empty').notEmpty(),
        body('UserID').notEmpty().isNumeric(),
    ],
    async function (req, res) {
        const data = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let extractedErrors = '';
            errors.array().map((err) => {
                extractedErrors += err.param + ':' + err.msg + '<br>';
            });
            console.log(extractedErrors);
            return res.json({
                success: false,
                error: extractedErrors,
            });
        }
        let change = await profile.changePassword(
            res.locals.User,
            data.UserID,
            data.Password
        );
        if (change) {
            let result = await profile.getUser(data.UserID);
            notifications.notifyChangePassword(result.Email, result.FirstName);
            return res.json({
                success: true,
                error: [],
            });
        } else {
            return res.json({
                success: false,
                error: 'Insufficient permissions',
            });
        }
    }
);

router.get(
    '/image/:id',
    auth.requireAuth,
    [check('id').isNumeric().withMessage('UserID should be a number')],
    async function (req, res) {
        let userid = req.params.id;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let extractedErrors = '';
            errors.array().map((err) => {
                extractedErrors += err.param + ':' + err.msg + '<br>';
            });
            console.log(extractedErrors);
            return res.status(404).json({
                success: false,
                error: extractedErrors,
            });
        }

        let data = await profile.getImage(userid);
        // console.log(data);
        res.setHeader('Content-Length', data.length);
        res.write(data, 'binary');
        res.end();
    }
);

router.post(
    '/upload-photo',
    auth.requireAuth,
    [body('UserID').notEmpty().isNumeric()],
    async function (req, res) {
        const data = req.body;
        console.log('Uploading Photo...', req.body.UserID);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let extractedErrors = '';
            errors.array().map((err) => {
                extractedErrors += err.param + ':' + err.msg + '<br>';
            });
            console.log(extractedErrors);
            return res.json({
                success: false,
                error: extractedErrors,
            });
        }
        await profile.changeImage(res.locals.User, data.UserID, data.Image);

        res.json({ success: true });
    }
);

router.get(
    '/id/:id/remove-all-dumpsters/',
    auth.requireAuth,
    auth.requireManager,
    [check('id').isNumeric().withMessage('UserID should be a number')],
    async function (req, res) {
        let id = req.params.id;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let extractedErrors = '';
            errors.array().map((err) => {
                extractedErrors += err.param + ':' + err.msg + '<br>';
            });
            console.log(extractedErrors);
            return res.status(404).json({
                success: false,
                error: extractedErrors,
            });
        }
        await profile.removeAllAssignedDumpstersFromDriver(id);
        let p = await profile.getProfileById(id);
        if (!p) {
            return res.redirect('/user/list');
        }
        res.render('profile', {
            profile: p,
        });
    }
);

module.exports = router;
