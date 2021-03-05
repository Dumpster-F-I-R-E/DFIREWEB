/* eslint-disable no-undef */

const userController = require('../controllers/userController');
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

test('test createUser with valid data', async () => {
    let user = {
        Role: "Admin",
    }
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

test('test createUser with invalid data', async () => {
    let user = {
        Role: 1,
    }
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
    expect(results).toBeUndefined();
});

test('test deleteUser with valid data', async () => {
    let user = {
        Role: 'Admin',
    }
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
    await userController.deleteUser(user, 1);
    var results = db.getNumberOfUsers();
    expect(results.Count).toBe(0);
});

test('test deleteUser with invalid data', async () => {
    let user = {
        Role: 'Admin',
    }
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
    await userController.deleteUser(user, 1);
    var results = db.getNumberOfUsers();
    expect(results.Count).toBe(0);
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
    var result = userController.getUser('u234');
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
    var result = userController.getUser(1);
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
    var result = userController.getUsers('u234','');
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
    var result = userController.getUsers('','Admin');
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
    var result = userController.getUsers('u234','Admin');
    expect(result).toBeDefined();
});

test('test getUsers with invalid data', async () => {
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
    var result = userController.getUsers(1,'');
    expect(result).toBeDefined();
});