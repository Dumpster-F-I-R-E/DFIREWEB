/* eslint-disable no-undef */

const userController = require('../controllers/userController');
const db = require('../database/db');

const initializeDatabase = async () => {
    let profile = {
        FirstName: 'John',
        LastName: 'Doe',
        Address: 'Calgary,AB',
        Email: 'admin@abc.com',
        Phone: '403-233-3333',
        StaffID: '1',
        UserID: '234',
        Username: 'u234',
        Password: '12324sd',
        Role: 'Admin',
        CompanyID: 1,
    };
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
    await db.addUser(profile);
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

test('test createUser with valid data', async () => {
    let user = {
        Role: 'Admin',
    };
    let profile = {
        FirstName: 'John',
        LastName: 'Doe',
        Address: 'Calgary,AB',
        Email: 'admin@abc.com',
        Phone: '403-233-3333',
        StaffID: '1',
        UserID: '234',
        Username: 'u234',
        Password: '12324sd',
        Role: 'Admin',
        CompanyID: 1,
    };
    var results = await userController.createUser(user, profile);
    expect(results).toBeDefined();
});

test('test deleteUser as Admin for an existing user', async () => {
    let user = {
        Role: 'Admin',
    };
    await userController.deleteUser(user, 1);
    var results = await db.getNumberOfUsers();
    expect(results.Count).toBe(0);
});

test('test deleteUser as Manager for an existing user', async () => {
    let user = {
        Role: 'Manager',
    };
    await userController.deleteUser(user, 1);
    var results = await db.getNumberOfUsers();
    expect(results.Count).toBe(1);
});


test('test deleteUser Admin for an nonexisting user', async () => {
    let user = {
        Role: 'Admin',
    };
    await userController.deleteUser(user, 2);
    var results = await db.getNumberOfUsers();
    expect(results.Count).toBe(1);
});

test('test getUser with valid data', async () => {
    let profile = {
        FirstName: 'John',
        LastName: 'Doe',
        Address: 'Calgary,AB',
        Email: 'admin@abc.com',
        Phone: '403-233-3333',
        StaffID: '1',
        UserID: '234',
        Username: 'u234',
        Password: '12324sd',
        Role: 'Admin',
        CompanyID: 1,
    };
    await db.addUser(profile);
    var result = await userController.getUser('u234');
    expect(result).toBeDefined();
});
test('test getUser with invalid data', async () => {
    let profile = {
        FirstName: 'John',
        LastName: 'Doe',
        Address: 'Calgary,AB',
        Email: 'admin@abc.com',
        Phone: '403-233-3333',
        StaffID: '1',
        UserID: '234',
        Username: 'u234',
        Password: '12324sd',
        Role: 'Admin',
        CompanyID: 1,
    };
    await db.addUser(profile);
    var result = await userController.getUser(1);
    expect(result).toBeUndefined();
});

test('test getUsers with valid name', async () => {
    let profile = {
        FirstName: 'John',
        LastName: 'Doe',
        Address: 'Calgary,AB',
        Email: 'admin@abc.com',
        Phone: '403-233-3333',
        StaffID: '1',
        UserID: '234',
        Username: 'u234',
        Password: '12324sd',
        Role: 'Admin',
        CompanyID: 1,
    };
    await db.addUser(profile);
    var result = await userController.getUsers('u234', '');
    expect(result).toBeDefined();
});

test('test getUsers with valid role', async () => {
    let profile = {
        FirstName: 'John',
        LastName: 'Doe',
        Address: 'Calgary,AB',
        Email: 'admin@abc.com',
        Phone: '403-233-3333',
        StaffID: '1',
        UserID: '234',
        Username: 'u234',
        Password: '12324sd',
        Role: 'Admin',
        CompanyID: 1,
    };
    await db.addUser(profile);
    var result = await userController.getUsers('', 'Admin');
    expect(result).toBeDefined();
});

test('test getUsers with valid name and role', async () => {
    let profile = {
        FirstName: 'John',
        LastName: 'Doe',
        Address: 'Calgary,AB',
        Email: 'admin@abc.com',
        Phone: '403-233-3333',
        StaffID: '1',
        UserID: '234',
        Username: 'u234',
        Password: '12324sd',
        Role: 'Admin',
        CompanyID: 1,
    };
    await db.addUser(profile);
    var result = await userController.getUsers('u234', 'Admin');
    expect(result).toBeDefined();
});
