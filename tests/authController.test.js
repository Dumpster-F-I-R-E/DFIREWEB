/* eslint-disable no-undef */

const auth = require('../controllers/authController');
const db = require('../database/db');

const initializeDatabase = async () => {
    let company = {
        CompanyID: 1,
        Name: 'General',
        Address: 'Calgary,AB',
        Phone: '345-343-3432',
    };
    await db.dropTables();
    await db.createTables();
    await db.addCompany(company);
};

const clearDatabase = async () => {
    await db.dropTables();
};

beforeAll(() => {
    var settings = {
        host: 'localhost',
        user: 'dfireweb',
        password: 'password',
        database: 'dfireweb_test',
        multipleStatements: true,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    };

    db.changeDatabase(settings);
});

afterAll(() => {
    db.closePool();
});

beforeEach(async () => {
    await initializeDatabase();
});

afterEach(async () => {
    await clearDatabase();
});

test('authentication with valid credentials', async () => {
    var user = {
        UserID: '234',
        Username: 'u234',
        Password: '12324sd',
        Role: 'Admin',
        CompanyID: 1,
    };
    await db.addUser(user);
    const { valid, authToken } = await auth.authenticate(
        user.Username,
        user.Password
    );
    expect(valid).toBe(true);
    expect(authToken).toBeTruthy();
});

test('authentication with invalid credentials', async () => {
    var user = {
        UserID: '234',
        Username: 'u234',
        Password: '12324sd',
        Role: 'Admin',
        CompanyID: 1,
    };
    await db.addUser(user);

    var user2 = {
        UserID: '2234',
        Username: '2u234',
        Password: '88787',
        Role: 'Admin',
        CompanyID: 1,
    };

    const { valid, token } = await auth.authenticate(
        user2.Username,
        user2.Password
    );
    expect(valid).toBe(false);
    expect(token).toBe(undefined);
});

test('logout', () => {
    var token = '213342';
    auth.authTokens[token] = 'user1';
    auth.logout(token);
    expect(auth.authTokens[token]).toBe(null);
});

test('requireAuth with valid login', () => {
    var token = '213342';
    auth.authTokens[token] = 'user1';
    var flag = false;
    req = {};
    req.cookies = {};
    req.cookies['AuthToken'] = token;
    const mockNext = jest.fn(() => {
        flag = true;
    });
    const res = {
        render: (page, message) => {
            console.log(message);
            flag = false;
        },
    };
    auth.requireAuth(req, res, mockNext);
    expect(mockNext.mock.calls.length).toBe(1);
    expect(flag).toBe(true);
});

test('requireAuth without valid login', () => {
    var token = '213342';
    auth.authTokens[token] = null;
    var flag = false;
    req = {};
    req.cookies = {};
    req.cookies['AuthToken'] = token;
    const mockNext = jest.fn(() => {
        flag = true;
    });
    const res = {
        render: (page, message) => {
            console.log(message);
            flag = true;
        },
    };
    auth.requireAuth(req, res, mockNext);
    expect(mockNext.mock.calls.length).toBe(0);
    expect(flag).toBe(true);
});
