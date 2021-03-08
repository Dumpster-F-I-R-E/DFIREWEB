const db = require('../database/db');

exports.getMessages = async (userID) => {
    console.log(userID);
    let result = await db.getMessages(userID);
    return result;
};

exports.getUnreadMessages = async (userID) => {
    let result = await db.getMessages(userID);
    let numUnread = 0;

    if (result) {
        for (let i = 0; i < result.length; i++) {
            if (
                result[i].Status === 'unread' ||
                result[i].Status === 'Unread'
            ) {
                numUnread++;
            }
        }
    }
    return numUnread;
};

exports.updateMessage = async (userID) => {
    await db.updateMessageStatus(userID, 'read');
};

exports.sendAlerts = async (userID, message) => {
    await db.addMessage(userID, message);
};
