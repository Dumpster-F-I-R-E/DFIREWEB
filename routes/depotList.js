var express = require('express');
var router = express.Router();
const auth = require('../controllers/authController');
const depots = require('../controllers/depotListController');

router.get(
    '/',
    auth.requireAuth,
    auth.requireAdminOrManager,
    async function (req, res) {
        let role = req.query.role;
        let name = req.query.name;
        let list = await depots.getDepots(name, role);
        res.render('depotList', {
            depots: list,
            role: role,
            name: name,
        });
    }
);

module.exports = router;
