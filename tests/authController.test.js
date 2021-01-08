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

beforeAll(async () => {
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

    await db.changeDatabase(settings);
});

afterAll(async () => {
    await db.closePool();
});

beforeEach(async () => {
    await initializeDatabase();
});

afterEach(async () => {
    await clearDatabase();
});

function initUser(user) {
    user.FirstName = 'John';
    user.LastName = 'Doe';
    user.Address = 'Calgary,AB';
    user.Email = 'admin@abc.com';
    user.Phone = '403-233-3333';
    user.StaffID = '1';
    return user;
}

async function addUser(user) {
    let u = initUser(user);
    await db.addUser(u);
}

test('authentication with valid credentials', async () => {
    var user = {
        UserID: '234',
        Username: 'u234',
        Password: '12324sd',
        Role: 'Admin',
        CompanyID: 1,
    };
    await addUser(user);
    const { valid, authToken, expires } = await auth.authenticate(
        user.Username,
        user.Password
    );
    expect(valid).toBe(true);
    expect(authToken).toBeTruthy();
    let current = new Date();
    expect(current < expires).toBe(true);
});

test('authentication with invalid credentials', async () => {
    var user = {
        UserID: '234',
        Username: 'u234',
        Password: '12324sd',
        Role: 'Admin',
        CompanyID: 1,
    };
    await addUser(user);

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

test('logout', async () => {
    let userId = 21322;
    var token = auth.generateAuthToken();
    let current = new Date();
    let expireDate = new Date(current.setDate(current.getDate() + 10));
    db.storeAuthToken(userId, token, expireDate);
    await auth.logout(token);
    let session = await db.getAuthToken(token);
    expect(session).toBe(undefined);
});

test('requireAuth with valid login', async () => {
    var token = '213342';
    //let userID = 23434;
    var user = {
        Username: 'u234',
        Password: '12324sd',
        Role: 'Admin',
        CompanyID: 1,
    };
    await addUser(user);
    let current = new Date();
    let expireDate = new Date(current.setDate(current.getDate() + 10));
    await db.storeAuthToken(1, token, expireDate);
    req = {};
    req.cookies = {};
    req.cookies['AuthToken'] = token;
    const mockNext = jest.fn();
    const res = {
        render: jest.fn(),
    };
    await auth.requireAuth(req, res, mockNext);
    expect(mockNext.mock.calls.length).toBe(1);
    expect(res.render.mock.calls.length).toBe(0);
});

test('requireAuth without valid login', async () => {
    var token = '213342saddfs';
    db.deleteAuthToken(token);
    req = {};
    req.cookies = {};
    req.cookies['AuthToken'] = token;
    const mockNext = jest.fn();
    const res = {
        render: jest.fn(),
    };
    await auth.requireAuth(req, res, mockNext);
    expect(mockNext.mock.calls.length).toBe(0);
    expect(res.render.mock.calls.length).toBe(1);
});

test('session token with valid credentials', async () => {
    var user = {
        Username: 'u234',
        Password: '12324sd',
        Role: 'Admin',
        CompanyID: 1,
    };
    await addUser(user);
    const { valid, authToken } = await auth.authenticate(
        user.Username,
        user.Password
    );
    expect(valid).toBe(true);
    let session = await db.getAuthToken(authToken);
    expect(session.UserID).toBe(1);
    expect(authToken).toBeTruthy();
    let current = new Date();
    expect(current < session.ExpireDate).toBe(true);
});
