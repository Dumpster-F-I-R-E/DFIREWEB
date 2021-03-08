/* eslint-disable no-undef */

const mainMenuController = require('../controllers/mainMenuController');
const db = require('../database/db');

const initializeDatabase = async () => {
    await db.createTables();
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
    db.changeDatabase(settings);
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

test('test getReports', async () => {
    var result = await mainMenuController.getReports();
    expect(result).toBeUndefined();
});