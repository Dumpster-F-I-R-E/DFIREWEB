const db = require('../database/db');

exports.createDepot = async (depot, data) => {
    let newDepot = await db.addDepot(data);
    return newDepot;
};

exports.deleteDepot = async (user, depotid) => {
    await db.deleteDepot(depotid);
};

exports.getDepots = async (name, address) => {
    let list = await db.getDepotsSearch(name, address);
    if (!list) {
        list = [];
    }
    return list;
};

exports.getAllDepots = async () => {
    let list = await db.getDepots();
    return list;
};
