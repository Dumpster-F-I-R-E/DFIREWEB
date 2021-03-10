/* eslint-disable no-undef */

const dumpsterController = require('../controllers/dumpsterController');
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
    await db.createTables();
    await db.addCompany(company);
    await db.addDumpster(dumpster1);
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

test('test getDumpstersInfo', async () => {
    let dumpsterreport = {
        DumpsterID: 1,
        Longitude: -114.08529,
        Latitude: 51.04886973630907,
        BatteryLevel: 38,
        FullnessLevel: 100,
        ErrorCode: 0,
        Time: '2020-12-19 17:00:00',
    };
    await db.storeDumpsterReport(dumpsterreport);
    let results = await dumpsterController.getDumpstersInfo();
    expect(results).toBeDefined();
});

test('test getDumpsterInfo with valid data', async () => {
    let dumpsterreport = {
        DumpsterID: 1,
        Longitude: -114.08529,
        Latitude: 51.04886973630907,
        BatteryLevel: 38,
        FullnessLevel: 100,
        ErrorCode: 0,
        Time: '2020-12-19 17:00:00',
    };
    await db.storeDumpsterReport(dumpsterreport);
    let results = await dumpsterController.getDumpsterInfo(1);
    expect(results).toBeDefined();
});

test('test createDumpster with valid data', async () => {
    let dumpster = {
        DumpsterSerialNumber: 0,
        CompanyID: 1,
    };
    var results = dumpsterController.createDumpster(dumpster);
    expect(results).toBeDefined();
});

test('test deleteDumpster with valid id', async () => {
    await dumpsterController.deleteDumpster(1);
    var results = db.getNumberOfDepots();
    expect(results).toBe(0);
});

test('test deleteDumpster with invalid id', async () => {
    await dumpsterController.deleteDumpster(2);
    var results = db.getNumberOfDepots();
    expect(results).toBe(1);
});

test('test getDumpsters with valid data', async () => {
    var results = dumpsterController.getDumpsters(0);
    expect(results).toBeDefined();
});

test('test removeAssignedDriverFromDumpster with valid data', async () => {
    let user = {
        Username: 'driver',
        Password: 'driver',
        Role: 'Driver',
        CompanyID: 1,
        FirstName: 'John',
        LastName: 'Doe',
        Address: 'Calgary,AB',
        Email: 'admin@abc.com',
        Phone: '403-233-3333',
    };
    await db.addUser(user);
    await db.setDriver(1, 1);
    await dumpsterController.removeAssignedDriverFromDumpster(1);
    var results = db.getNumberOfDumpstersWithDrivers();
    expect(results).toBe(0);
});
