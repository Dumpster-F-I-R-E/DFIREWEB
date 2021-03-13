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
    let dumpster1 = {
        DumpsterSerialNumber: 0,
        CompanyID: 1,
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
    await db.addDumpster(dumpster1);
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

test('test setLocation', async () => {
    await driverController.setLocation(1, 1,1);
    var results = db.getDriverFromDriversWithUserID(1);
    expect(results).toBe(1);
});