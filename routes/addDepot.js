var express = require('express');
var router = express.Router();
const auth = require('../controllers/authController');
const depot = require('../controllers/depotController');

router.get(
    '/',
    auth.requireAuth,
    auth.requireAdminOrManager,
    function (req, res) {
        res.render('addDepot');
    }
);

router.post(
    '/',
    auth.requireAuth,
    auth.requireAdminOrManager,
    async function (req, res) {
        const data = req.body;
        let u = await depot.createDepot(res.locals.Depot, data);
        let msg = '';
        let s = true;
        if (!u) {
            msg = "You don't have permission to create this depot";
            s = false;
        }
        res.json({
            success: s,
            user: u,
            error: msg,
        });
    }
);

// router.post(
//     '/',
//     auth.requireAuth,
//     auth.requireAdminOrManager,
//     async function (req, res) {
//         const data = req.body;
//         await user.deleteUser(res.locals.User, data.UserID);
//         let msg = '';
//         res.json({
//             success: true,
//             error: msg,
//         });
//     }
// );

module.exports = router;
