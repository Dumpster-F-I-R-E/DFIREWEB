const crypto = require('crypto');
const db = require('../database/db');

var Users = [
    {
        username: "root",
        password: "root"
    }
];

exports.Users = Users;
// This will hold the users and authToken related to users
var authTokens = {};

exports.authTokens = authTokens;

const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}

exports.authenticate = async (username, password) => {

    let result = { valid: false, authToken: null };
    var user = await db.getUserByUsername(username);
    if (user) {

        if (user.Password === password) {
            const authToken = generateAuthToken();

            // Store authentication token
            authTokens[authToken] = user;

            result = {
                valid: true,
                authToken: authToken
            };

        }
    }

    return result;
}

exports.logout = (authToken) => {
    authTokens[authToken] = null;
}



exports.requireAuth = (req, res, next) => {
    // Get auth token from the cookies
    const authToken = req.cookies['AuthToken'];
    req.user = authTokens[authToken];

    if (req.user) {
        next();
    } else {
        res.render('login', {
            message: 'Please login to continue',
            messageClass: 'alert-danger'
        });
    }
};