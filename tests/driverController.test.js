// /* eslint-disable no-undef */

// const driver = require('../controllers/driverController');
// const db = require('../database/db');

// const initializeDatabase = async () => {
//     let company = {
//         CompanyID: 1,
//         Name: 'General',
//         Address: 'Calgary,AB',
//         Phone: '345-343-3432',
//     };
//     await db.dropTables();
//     await db.createTables();
//     await db.addCompany(company);
// };

// const clearDatabase = async () => {
//     await db.dropTables();
// };

// beforeAll(async () => {
//     var settings = {
//         host: 'localhost',
//         user: 'dfireweb',
//         password: 'password',
//         database: 'dfireweb_test',
//         multipleStatements: true,
//         waitForConnections: true,
//         connectionLimit: 10,
//         queueLimit: 0,
//     };

//     await db.changeDatabase(settings);
// });

// afterAll(async () => {
//     await db.closePool();
// });

// beforeEach(async () => {
//     await initializeDatabase();
// });

// afterEach(async () => {
//     await clearDatabase();
// });

// function initUser(user) {
//     user.FirstName = 'John';
//     user.LastName = 'Doe';
//     user.Address = 'Calgary,AB';
//     user.Email = 'admin@abc.com';
//     user.Phone = '403-233-3333';
//     user.StaffID = '1';
//     return user;
// }

// async function addUser(user) {
//     let u = initUser(user);
//     await db.addUser(u);
// }

// async function addDriver(user) {
//     let u = initUser(user);
//     await db.addDriver(u);
// }

// // test('authentication with valid credentials', async () => {
// //     var user = {
// //         UserID: '234',
// //         Username: 'u234',
// //         Password: '12324sd',
// //         Role: 'Admin',
// //         CompanyID: 1,
// //     };
// //     await addUser(user);

// // });