/* eslint-disable no-undef */

const { ExpectationFailed } = require('http-errors');
const messageController = require('../controllers/messageController');
const db = require('../database/db');

const initializeDatabase = async () => {
    let company = {
        CompanyID: 1,
        Name: 'General',
        Address: 'Calgary,AB',
        Phone: '345-343-3432',
    };
    let user = {
        FirstName: 'John',
        LastName: 'Doe',
        Address: 'Calgary,AB',
        Email: 'admin@abc.com',
        Phone: '403-233-3333',
        StaffID: '1',
        UserID: '234',
        Username: 'u234',
        Password: '12324sd',
        Role: 'driver',
        CompanyID: 1,
    };
    await db.createTables();
    await db.addCompany(company);
    await db.addUser(user);
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

test('test getMessages with valid data', async () => {
    var results = await messageController.getMessages(1);
    expect(results).toBeUndefined();
});

test('test getUnreadMessages with valid data', async () => {
    var results = await messageController.getUnreadMessages(1);
    expect(results).toBe(0);
});

test('test updateMessage with valid data', async () => {
    await messageController.sendAlerts(1, 'test');
    await messageController.updateMessage(1);
    var results = await db.getDriverMessageByID(1);
    expect(results.Status).toBe("read");
});

test('test updateMessage with invalid data', async () => {
    await messageController.sendAlerts(1, 'test');
    await messageController.updateMessage(2);
    var results = await db.getDriverMessageByID(1);
    expect(results.Status).toBe('unread');
});

test('test sendAlerts with valid data', async () => {
    await messageController.sendAlerts(1, 'test');
    var results = await db.getNumberOfDriverMessages();
    expect(results.Count).toBe(1);
});

test('test sendAlerts with invalid data', async () => {
    // await messageController.sendAlerts(2, 'test');
    // var results = await db.getNumberOfDriverMessages();
    // expect(results.Count).toBe(0);
});
