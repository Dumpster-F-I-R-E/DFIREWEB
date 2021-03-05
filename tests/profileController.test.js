/* eslint-disable no-undef */

const depot = require('../controllers/depotController');
const db = require('../database/db');

const initializeDatabase = async () => {
    let depot = {
        Name: 'SW Dumpster',
        Address: 'Calgary, AB',
        Longitude: '-114.08529',
        Latitude: '51.05011',
        CompanyID: 1,
    };
    let company = {
        CompanyID: 1,
        Name: 'General',
        Address: 'Calgary,AB',
        Phone: '345-343-3432',
    };
    await db.createTables();
    await db.addCompany(company);
    await db.addDepot(depot);
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

test('test getMessages with valid data', async () => {});

test('test getMessages with invalid data', async () => {});

test('test getMessages with valid data', async () => {});

test('test getMessages with invalid data', async () => {});

test('test getMessages with valid data', async () => {});

test('test getMessages with invalid data', async () => {});

test('test getMessages with valid data', async () => {});

test('test getMessages with invalid data', async () => {});

test('test getMessages with valid data', async () => {});

test('test getMessages with invalid data', async () => {});

test('test getMessages with valid data', async () => {});

test('test getMessages with invalid data', async () => {});

test('test getMessages with valid data', async () => {});

test('test getMessages with invalid data', async () => {});

test('test getMessages with valid data', async () => {});

test('test getMessages with invalid data', async () => {});

test('test getMessages with valid data', async () => {});

test('test getMessages with invalid data', async () => {});

test('test getMessages with valid data', async () => {});

test('test getMessages with invalid data', async () => {});

test('test getMessages with valid data', async () => {});

test('test getMessages with invalid data', async () => {});

test('test getMessages with valid data', async () => {});

test('test getMessages with invalid data', async () => {});
