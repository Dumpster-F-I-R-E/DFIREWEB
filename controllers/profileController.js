const db = require('../database/db');

exports.getProfileInfo = async (authToken) => {
    let session = await db.getAuthToken(authToken);
    let userId = session.UserID;
    let data = await db.getProfile(userId);
    
    return data;
};

exports.updateProfile = async (authToken, profile) => {
    let session = await db.getAuthToken(authToken);
    profile.UserID = session.UserID;
    await db.updateProfile(profile);
}