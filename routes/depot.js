var express = require('express');
var router = express.Router();
const auth = require('../controllers/authController');
const depot = require('../controllers/depotController');

router.get(
    '/add',
    auth.requireAuth,
    auth.requireAdminOrManager,
    function (req, res) {
        res.render('addDepot');
    }
);

router.post(
    '/add',
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
            depot: u,
            error: msg,
        });
    }
);

router.post(
    '/delete',
    auth.requireAuth,
    auth.requireAdminOrManager,
    async function (req, res) {
        const data = req.body;
        await depot.deleteDepot(res.locals.Depot, data.DepotID);
        let msg = '';
        res.json({
            success: true,
            error: msg,
        });
    }
);

router.get(
    '/list',
    auth.requireAuth,
    auth.requireAdminOrManager,
    async function (req, res) {
        let address = req.query.address;
        let name = req.query.name;
        let list = await depot.getDepots(name, address);
        res.render('depotList', {
            depots: list,
            address: address,
            name: name,
        });
    }
);

module.exports = router;
