const db = require('../database/db');

exports.createDepot = async (depot, data) => {
        let newDepot = await db.addDepot(data);
        return newDepot;
};

exports.deleteDepot = async (user, userid) => {
    // if (user.Role == 'Admin') {
    //     await db.deleteUser(userid);
    // }
};
