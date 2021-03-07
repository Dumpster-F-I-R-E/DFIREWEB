/* eslint-disable no-undef */

const { ExpectationFailed } = require('http-errors');
const { requireAdmin } = require('../controllers/authController');
const profileController = require('../controllers/profileController');
const db = require('../database/db');

const initializeDatabase = async () => {
    let company = {
        CompanyID: 1,
        Name: 'General',
        Address: 'Calgary,AB',
        Phone: '345-343-3432',
    };
    let profile = {
        FirstName: 'John',
        LastName: 'Doe',
        Address: 'Calgary,AB',
        Email: 'admin@abc.com',
        Phone: '403-233-3333',
        StaffID: '1',
        Username: 'u234',
        Password: '12324sd',
        Role: 'Admin',
        CompanyID: 1,
    };
    await db.createTables();
    await db.addCompany(company);
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

test('test getProfileById with existing user', async () => {
    var result = await profileController.getProfileById(1);
    expect(result).toBeDefined();
});

test('test getProfileById with non existing user', async () => {
    var result = await profileController.getProfileById(2);
    expect(result).toBeUndefined();
});

test('test getProfileById with invalid data', async () => {
    var result = await profileController.getProfileById('a');
    expect(result).toBeUndefined();
});

test('test getNumberOfAssignedDumpsterForUserId with existing user', async () => {
    var result = await profileController.getNumberOfAssignedDumpsterForUserId(1);
    expect(result.DumpsterCount).toBe(0);
});

test('test getNumberOfAssignedDumpsterForUserId with non existing user', async () => {
    var result = await profileController.getNumberOfAssignedDumpsterForUserId(2);
    expect(result.DumpsterCount).toBe(0);
});

test('test getNumberOfAssignedDumpsterForUserId with invalid data', async () => {
    var result = await profileController.getNumberOfAssignedDumpsterForUserId('a');
    expect(result.DumpsterCount).toBe(0);
});

test('test updateProfile with valid data', async () => {
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
        UserID: '1',
        Username: 'u234',
        Password: '12324sd',
        Role: 'Admin',
        CompanyID: 1,
    };
    var result = await profileController.updateProfile(user, profile);
    expect(result).toBe(7);
});

test('test getImage for existing user', async () => {
    var result = await profileController.getImage(1);
    expect(result).toBeDefined();
});

test('test getImage for non existing user', async () => {
    var result = await profileController.getImage(2);
    expect(result).toBeDefined();
});

test('test getImage with invalid data', async () => {
    var result = await profileController.getImage('a');
    expect(result).toBeDefined();
});

test('test changePassword as Admin', async () => {
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
        Username: 'u234',
        Password: '12324sd',
        Role: 'Manager',
        CompanyID: 1,
    };
    await db.addUser(profile);
    var result = await profileController.changePassword(user,2, "testpassword");
    expect(result).toBeTruthy();
});

test('test changePassword as Manager', async () => {
    let user = {
        Role: 'Manager',
    }
    let profile = {
        FirstName: 'John',
        LastName: 'Doe',
        Address: 'Calgary,AB',
        Email: 'admin@abc.com',
        Phone: '403-233-3333',
        StaffID: '1',
        Username: 'u234',
        Password: '12324sd',
        Role: 'Manager',
        CompanyID: 1,
    };
    await db.addUser(profile);
    var result = await profileController.changePassword(user,2, "testpassword");
    expect(result).toBeTruthy();
});

test('test getUser for existing user', async () => {
    var result = await profileController.getUser(1);
    expect(result).toBeDefined();
});

test('test getUser for non existing user', async () => {
    var result = await profileController.getUser(2);
    expect(result).toBeUndefined();
});

test('test getUser with invalid data', async () => {
    var result = await profileController.getUser('a');
    expect(result).toBeUndefined();
});

test('test getRole for existing user', async () => {
    var result = await profileController.getRole(1);
    expect(result).toBe('Admin');
});

test('test getRole for non existing user', async () => {
    var result = await profileController.getRole(2);
    expect(result).toBeUndefined();
});

test('test getRole with invalid data', async () => {
    var result = await profileController.getRole('a');
    expect(result).toBeUndefined();
});