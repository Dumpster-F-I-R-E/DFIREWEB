/* eslint-disable no-undef */

const driverController = require('../controllers/driverController');
const db = require('../database/db');

const initializeDatabase = async () => {
    let company = {
        CompanyID: 1,
        Name: 'General',
        Address: 'Calgary,AB',
        Phone: '345-343-3432',
    };
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

// test('test getDrivers', async () => {
//     var results = await driverController.getDrivers();
//     expect(results).toBeUndefined();
// });

// test('test getRoutes', async () => {
//     var results = await driverController.getDrivers();
//     expect(results).toBeUndefined();
// });

test('test', async () => {
    var results = 1
    expect(results).toBe(1);
});