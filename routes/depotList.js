var express = require('express');
var router = express.Router();
const auth = require('../controllers/authController');
const depots = require('../controllers/depotListController');

router.get(
    '/',
    auth.requireAuth,
    auth.requireAdminOrManager,
    async function (req, res) {
        let address = req.query.address;
        let name = req.query.name;
        let list = await depots.getDepots(name, address);
        res.render('depotList', {
            depots: list,
            address: address,
            name: name,
        });
    }
);

module.exports = router;
