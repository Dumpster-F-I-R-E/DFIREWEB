var express = require('express');
var router = express.Router();
const auth = require('../controllers/authController');
const profile = require('../controllers/profileController');
const emailController = require('../controllers/emailController');

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
    res.render('profile', {
        profile: p,
        role: res.locals.User.Role,
    });
});

router.post('/', auth.requireAuth, async function (req, res) {
    const data = req.body;
    await profile.updateProfile(res.locals.User, data);
    let subj = "Profile has been changed";
    let text = "Dear " + req.body.FirstName + "," +"<br> Your information has been updated. <br> Thanks, <br> DFIRE Team";
    let email = req.body.Email;
    emailController.sendMail(email,subj,text);
    res.redirect('/profile');
});

router.get(
    '/id/:id',
    auth.requireAuth,
    auth.requireAdmin,
    async function (req, res) {
        let id = req.params.id;
        let p = await profile.getProfileById(id);
        let role = await profile.getRole(id);
        if (!p) {
            p = {
                UserID: id,
                Role: role,
                FirstName: 'First Name',
                LastName: 'Last Name',
                Address: '24 Ave Calgary, AB',
                Email: 'admin@abc.com',
                Phone: '403-343-3434',
                StaffID: 'Staff ID',
            };
        }

        res.render('profile', {
            profile: p,
        });
    }
);

router.post('/change-password', auth.requireAuth, async function (req, res) {
    const data = req.body;
    await profile.changePassword(res.locals.User, data.UserID, data.Password);
    let result = await profile.getUser(data.UserID);
    let subj = "Password has been changed";
    let text = "Dear " + result.FirstName + "," +"<br> Your password has been updated. Please contact the admin for the new password.<br> Thanks, <br> DFIRE Team";
    let email = result.Email;
    emailController.sendMail(email,subj,text);
    res.redirect('/profile');
});

router.get('/image/:id', auth.requireAuth, async function (req, res) {
    let userid = req.params.id;
    let data = await profile.getImage(userid);
    // console.log(data);
    res.setHeader('Content-Length', data.length);
    res.write(data, 'binary');
    res.end();
});

router.post('/upload-photo', auth.requireAuth, async function (req, res) {
    const data = req.body;
    console.log('Uploading Photo...', req.body.UserID);
    await profile.changeImage(res.locals.User, data.UserID, data.Image);

    res.json({ success: true });
});

module.exports = router;
