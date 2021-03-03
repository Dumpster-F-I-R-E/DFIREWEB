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

});

test('test getDumpsterInfo with valid data', async () => {

});

test('test getDumpsterInfo with invalid data', async () => {

});

test('test createDumpster with valid data', async () => {
    let dumpster = {
        DumpsterSerialNumber: 0,
        CompanyID: 1,
    };
    var results = dumpsterController.createDumpster(dumpster);
    expect(results).toBeDefined();
});

test('test createDumpster with invalid data', async () => {
    let dumpster = {
        DumpsterSerialNumber: 'a',
        CompanyID: 1,
    };
    var results = dumpsterController.createDumpster(dumpster);
    expect(results).toBeDefined();
});

test('test deleteDumpster ', async () => {

});

test('test createDumpster with valid data', async () => {

});

test('test getDumpsters with valid data', async () => {

});

test('test getDumpsters with invalid data', async () => {

});

test('test removeAssignedDriverFromDumpster with valid data', async () => {

});

test('test removeAssignedDriverFromDumpster with invalid data', async () => {

});

test('test forcast with valid data', async () => {

});

test('test forcast with invalid data', async () => {
    
});