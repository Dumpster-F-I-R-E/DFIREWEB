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

exports.updateProfile = async (user, profile) => {
  
    if(user.Role == 'Admin'){
        let p = await db.getProfile(profile.UserID);
        if(p){
            await db.updateProfile(profile);
            await db.changeRole(profile.UserID, profile.Role);
        }
     
    } else if(user.UserID == profile.UserID){
        user.FirstName = profile.FirstName;
        user.LastName = profile.LastName;
        user.Address = profile.Address;
        user.Phone = profile.Phone;
        user.Email = profile.Email;
        await db.updateProfile(user);
    } else if(user.Role == 'Manager'){
        let p = await db.getProfile(profile.UserID);
        if (!p) {
            return;
        }
        p.FirstName = profile.FirstName;
        p.LastName = profile.LastName;
        p.Address = profile.Address;
        p.Phone = profile.Phone;
        p.Email = profile.Email;
        await db.updateProfile(p);
    }
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

exports.changePassword = async (user, userid, password) => {
    if(user.Role == 'Admin' || user.UserID == userid){
        await db.changePassword(userid, password);
    }
    
};

exports.changeImage = async (user,userid, image) => {
    // image = await readFile('public/images/profile.png');
    console.log('Profile Controller');
   
    if(user.Role == 'Admin' || user.UserID == userid){
        await db.changeImage(userid, image);
    }
};


exports.getUser = async (userid) => {
    let u = await db.getUserByUserID(userid);
    return u;
};


exports.getRole = async (userid) => {
    let role =  await db.getRole(userid);
    console.log('Role', role);
    return role.Role;
};