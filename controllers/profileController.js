const db = require('../database/db');

exports.getProfileInfo = async (authToken) => {
    let session = await db.getAuthToken(authToken);
    let userId = session.UserID;
    let data = await db.getProfile(userId);
    let num = await db.getNumberOfAssignedDumpsterForUserId(userId);
    return data;
};

exports.getProfileById = async (userId) => {
    let data = await db.getProfile(userId);
    return data;
};

exports.getNumberOfAssignedDumpsterForUserId = async (userId) => {
    let data = await db.getNumberOfAssignedDumpsterForUserId(userId);
    return data;
};

const permissions = (user, profile) => {
    if (user.Role == 'Admin')
        return [
            'StaffID',
            'FirstName',
            'LastName',
            'Address',
            'Phone',
            'Email',
            'Role',
        ];
    if (user.Role == 'Manager' && profile.Role == 'Driver')
        return ['FirstName', 'LastName', 'Address', 'Phone', 'Email'];
    if (user.UserID == profile.UserID)
        return ['FirstName', 'LastName', 'Address', 'Phone', 'Email'];

    return [];
};

exports.updateProfile = async (user, profile) => {
    let p = await db.getProfile(profile.UserID);
    console.log(p['Role']);
    console.log(user);
    let perm = permissions(user, p);

    for (var field in perm) {
        if (field == 'Role') {
            await db.changeRole(profile.UserID, profile.Role);
        } else {
            p[field] = profile[field];
        }
    }
    if (perm) await db.updateProfile(profile);

    return perm.length;
};

const fs = require('fs');
const util = require('util');

// Convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile);

exports.getImage = async (userid) => {
    let data = await db.getImage(userid);
    if (!data || !data.Image) {
        data = await readFile('public/images/profile.png');
    } else {
        data = data.Image.toString('utf-8');
    }

    return data;
};

exports.changePassword = async (user, userid, password) => {
    console.log(user);
    if (user.Role == 'Admin' || user.UserID == userid) {
        await db.changePassword(userid, password);
        return true;
    } else {
        return false;
    }
};

exports.changeImage = async (user, userid, image) => {
    if (user.Role == 'Admin' || user.UserID == userid) {
        await db.changeImage(userid, image);
    }
};

exports.getUser = async (userid) => {
    let u = await db.getUserByUserID(userid);
    return u;
};

exports.getRole = async (userid) => {
    let role = await db.getRole(userid);
    return role.Role;
};

exports.removeAllAssignedDumpstersFromDriver = async (userid) => {
    await db.removeAllAssignedDumpstersFromDriver(userid);
};
