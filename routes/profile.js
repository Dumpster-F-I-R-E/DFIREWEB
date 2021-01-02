var express = require('express');
var router = express.Router();
const auth = require('../controllers/authController');
const profile = require('../controllers/profileController');

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
        role: res.locals.User.Role
    });
});

router.post('/', auth.requireAuth, async function (req, res) {
    const data = req.body;
    await profile.updateProfile(res.locals.User, data);
    res.redirect('/profile');
});

router.get('/id/:id', auth.requireAuth, auth.requireAdmin, async function (req, res) {
    let id = req.params.id;
    let p = await profile.getProfileById(id);
    let role = await profile.getRole(id);
    if (!p) {
        p = {
            UserID: id,
            Role: role,
            FirstName: 'Fist Name',
            LastName: 'Last Name',
            Address: '24 Ave Calgary, AB',
            Email: 'admin@abc.com',
            Phone: '403-343-3434',
            StaffID: 'Staff ID',
        };
    }
    
    res.render('profile', {
        profile: p,
        role: role
    });
});

router.post('/change-password', auth.requireAuth, async function (req, res) {
    const data = req.body;
    await profile.changePassword(data.UserID, data.Password);
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
    console.log("Uploading Photo...", req.body.UserID);
    await profile.changeImage(data.UserID, data.Image);
   
    res.json({success:true});
});

module.exports = router;
