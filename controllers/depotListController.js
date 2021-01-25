const db = require('../database/db');

exports.getDepots = async (name, role) => {
    let list = await db.getDepotsSearch(name, role);
    if (!list) {
        list = [];
    }
    return list;
};
