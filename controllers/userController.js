const db = require('../database/db');

exports.createUser = async (user, profile) => {
    console.log(profile);
    if (user.Role == 'Admin') {
        await db.createUser(profile);
        let account = await db.getUserByUsername(profile.Username);
        return account;
    }
    if (user.Role == 'Manager' && profile.Role == 'Driver') {
        await db.createUser(profile);
        let account = await db.getUserByUsername(profile.Username);
        return account;
    }
};

exports.deleteUser = async (user, userid) => {
    if (user.Role == 'Admin') {
        await db.deleteUser(userid);
    }
};

exports.getUser = async (username) => {
    let u = await db.getUserByUsername(username);
    return u;
};

exports.getUsers = async (name, role) => {
    let list = await db.getUsersSearch(name, role);
    if (!list) {
        list = [];
    }
    return list;
};
