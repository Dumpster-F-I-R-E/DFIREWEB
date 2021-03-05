const crypto = require('crypto');
const db = require('../database/db');
const error = require('../controllers/error');

const tokenExpireDays = 30;

exports.generateAuthToken = () => {
    return crypto.randomBytes(60).toString('hex');
};

const salt = 'dEnELfire';

exports.hashPassword = (password) => {
    const hash = crypto.createHash('sha256');
    hash.update(salt + password);
    return hash.digest('utf8');
};

exports.authenticate = async (username, password) => {
    let result = { valid: false, authToken: null };
    var user = await db.getUserByUsername(username);
    if (user) {
        if (user.Password === exports.hashPassword(password)) {
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
            let user = await db.getUserByUserID(session.UserID);
            res.locals = {
                User: user,
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

exports.requireAdmin = (req, res, next) => {
    if (res.locals.User.Role === 'Admin') {
        next();
    } else {
        return error.redirect(
            res,
            '/mainMenu',
            'Insufficient Permissions(Admin)'
        );
    }
};

exports.requireManager = (req, res, next) => {
    if (res.locals.User.Role === 'Manager') {
        next();
    } else {
        return error.redirect(
            res,
            '/mainMenu',
            'Insufficient Permissions(Manager)'
        );
    }
};

exports.requireAdminOrManager = (req, res, next) => {
    if (
        res.locals.User.Role === 'Admin' ||
        res.locals.User.Role === 'Manager'
    ) {
        next();
    } else {
        return error.redirect(
            res,
            '/mainMenu',
            'Insufficient Permissions(Admin or Manager)'
        );
    }
};

exports.requireManagerOrDriver = (req, res, next) => {
    if (
        res.locals.User.Role === 'Manager' ||
        res.locals.User.Role === 'Driver'
    ) {
        next();
    } else {
        res.redirect('/mainMenu');
    }
};
