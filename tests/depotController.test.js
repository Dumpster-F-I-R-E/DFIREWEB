/* eslint-disable no-undef */

const depot = require('../controllers/depotController');
const db = require('../database/db');

const initializeDatabase = async () => {
    let depot = {
        Name: 'SW Dumpster',
        Address: 'Calgary, AB',
        Longitude: '-114.08529',
        Latitude: '51.05011',
        CompanyID: '1',
    };
    await db.dropTables();
    await db.createTables();
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

test('delete dumpster with id 1', async () => {
    await db.deleteDepot(1);
    let sql = mysql.format('SELECT * FROM Depots');
    var results = await pool.query(sql).catch(printErrors);
    expect(results.length).toBe(0);

});






