const db = require('../database/db');

exports.getProfileInfo = async (authToken) => {
    let session = await db.getAuthToken(authToken);
    let userId = session.UserID;
    let data = await db.getProfile(userId);

    return data;
};

exports.getProfileById = async (userId) => {
    let data = await db.getProfile(userId);

    return data;
};

exports.updateProfile = async (authToken, profile) => {
    let session = await db.getAuthToken(authToken);
    profile.UserID = session.UserID;
    await db.updateProfile(profile);
};

const fs = require('fs');
const util = require('util');

// Convert fs.readFile into Promise version of same    
const readFile = util.promisify(fs.readFile);

exports.getImage = async (userid) => {
    let data = await db.getImage(userid);
    // console.log("Data", data);
    if(!data || !data.Image){
        data = await readFile('public/images/profile.png');
      
    }else{
        data = data.Image.toString('utf-8');

    }
   
    return data;
};

exports.changePassword = async (userid, password) => {
    await db.changePassword(userid, password);
};

exports.changeImage = async (userid, image) => {
    // image = await readFile('public/images/profile.png');
    console.log("Profile Controller");
    await db.changeImage(userid, image);
};
