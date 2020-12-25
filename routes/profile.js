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
    });
});

router.post('/', auth.requireAuth, async function (req, res) {
    const authToken = req.cookies['AuthToken'];
    const data = req.body;
    await profile.updateProfile(authToken, data);
    res.redirect('/profile');
});

router.get('/id/:id', auth.requireAuth, async function (req, res) {
    let id = req.params.id;
    let p = await profile.getProfileById(id);
    if (!p) {
        p = {
            UserID: 'UserID',
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
    });
});

module.exports = router;
