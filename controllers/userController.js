const db = require('../database/db');

exports.createUser = async (user, profile) => {
    let account = await db.createUser(profile);
    return account;
};

exports.deleteUser = async (user, userid) => {
    if(user.Role == 'Admin'){
        await db.deleteUser(userid);
    }
};