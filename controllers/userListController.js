const db = require('../database/db');

exports.getUsers = async (name, role) => {
    let list = await db.getUsersSearch(name, role);
    if (!list) {
        list = [];
    }
    return list;
};
