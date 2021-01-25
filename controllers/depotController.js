const db = require('../database/db');

exports.createDepot = async (depot, data) => {
        let newDepot = await db.createDepot(data);
        return newDepot;
};

exports.deleteDepot = async (user, depotid) => {
        await db.deleteDepot(depotid);
};
