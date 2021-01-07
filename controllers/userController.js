const db = require('../database/db');

exports.createUser = async (user, profile) => {
    if(user.Role == 'Admin'){
        let account = await db.createUser(profile);
        return account;
    }
    if(user.Role == 'Manager' && profile.Role == 'Driver'){
        let account = await db.createUser(profile);
        return account;
    }
    
};

exports.deleteUser = async (user, userid) => {
    if(user.Role == 'Admin'){
        await db.deleteUser(userid);
    }
};