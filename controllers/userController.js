const db = require('../database/db');

exports.createUser = async (user, profile) => {
    let account = await db.createUser(profile);
    return account;
};