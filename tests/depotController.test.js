/* eslint-disable no-undef */

const depotController = require('../controllers/depotController');
const db = require('../database/db');

const initializeDatabase = async () => {
    var depot1 = {
        Name: 'SW Dumpster',
        Address: 'Calgary, AB',
        Longitude: '-114.08529',
        Latitude: '51.05011',
        CompanyID: '1',
    };
    let company = {
        CompanyID: 1,
        Name: 'General',
        Address: 'Calgary,AB',
        Phone: '345-343-3432',
    };
    await db.createTables();
    await db.addCompany(company);
    await db.addDepot(depot1);
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

test('test 1', async () => {
    var results = await db.getNumberOfDepots();
    expect(results.Count).toBe(1);
});
test('test deleteDepot for existing depot', async () => {
    await depotController.deleteDepot(1);
    var results = await db.getNumberOfDepots();
    expect(results.Count).toBe(0);
});

test('test deleteDepot for non-existing depot', async () => {
    await depotController.deleteDepot(4);
    var results = await db.getNumberOfDepots();
    expect(results.Count).toBe(1);
});

test('test deleteDepot not using a number', async () => {
    await depotController.deleteDepot('a');
    var results = await db.getNumberOfDepots();
    expect(results.Count).toBe(1);
});

test('test createDepot with valid input', async () => {
    let depot = {
        Name: 'SW Dumpster',
        Address: 'Calgary, AB',
        Longitude: '-114.08529',
        Latitude: '51.05011',
        CompanyID: 1,
    };
    let nothing = '';
    var results = await depotController.createDepot(nothing, depot);
    expect(results).toBeDefined();
});

test('test createDepot with invalid input', async () => {
    try {
        let depot = {
            Name: 'SW Dumpster',
            Address: 'Calgary, AB',
            Longitude: '-114.08529',
            Latitude: '51.05011',
            CompanyID: 'a',
        };
        let nothing = '';
        await depotController.createDepot(nothing, depot);
    } catch (error) {
        expect(error);
    }

    expect(results).toBeUndefined();
});

test('test getDepots input name only', async () => {
    let name = 'SW Dumpster';
    let address = '';
    let results = await depotController.getDepots(name, address);
    expect(results).toBeDefined();
});

test('test getDepots input address only', async () => {
    let name = '';
    let address = 'Calgary, AB';
    let results = await depotController.getDepots(name, address);
    expect(results).toBeDefined();
});

test('test getDepots input name and address', async () => {
    let name = 'SW';
    let address = 'Calgary';
    let results = await depotController.getDepots(name, address);
    expect(results).toBeDefined();
});

test('test getAllDepots', async () => {
    var results = depotController.getAllDepots();
    expect(results).toBeDefined();
});
