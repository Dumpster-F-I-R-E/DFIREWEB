const crypto = require('crypto');
const db = require('../database/db');

const tokenExpireDays = 30;

exports.generateAuthToken = () => {
    return crypto.randomBytes(60).toString('hex');
};

exports.authenticate = async (username, password) => {
    let result = { valid: false, authToken: null };
    var user = await db.getUserByUsername(username);
    if (user) {
        if (user.Password === password) {
            const authToken = exports.generateAuthToken();

            // Store authentication token
            let current = new Date();
            let expireDate = new Date(
                current.setDate(current.getDate() + tokenExpireDays)
            );
            await db.storeAuthToken(user.UserID, authToken, expireDate);
            result = {
                valid: true,
                authToken: authToken,
                expires: expireDate,
            };
        }
    }

    return result;
};

exports.logout = async (authToken) => {
    await db.deleteAuthToken(authToken);
};

exports.isValidSession = async (authToken) => {
    let session = await db.getAuthToken(authToken);
    if (session) {
        let current = new Date();
        if (session.ExpireDate > current) {
            return true;
        }
    }
    return false;
};

exports.requireAuth = async (req, res, next) => {
    // Get auth token from the cookies
    const authToken = req.cookies['AuthToken'];
    // req.user = authTokens[authToken];
    let session = await db.getAuthToken(authToken);
    if (session) {
        let current = new Date();
        if (session.ExpireDate > current) {
            // Session is still valid
            res.locals = {
                UserID: session.UserID
            };
            next();
        } else {
            // Session has expired
            db.deleteAuthToken(authToken);

            res.render('login', {
                message: 'Your session has expired. Please login to continue',
                messageClass: 'alert-danger',
            });
        }
    } else {
        res.render('login', {
            message: 'Please login to continue',
            messageClass: 'alert-danger',
        });
    }
};
