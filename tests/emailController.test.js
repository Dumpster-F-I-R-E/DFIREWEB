/* eslint-disable no-undef */

const emailController = require('../controllers/emailController');

beforeAll(async () => {});

afterAll(async () => {});

beforeEach(async () => {});

afterEach(async () => {});

test('test sendMail with valid data', async () => {
    email = 'dfirecapstone+1@gmail.com';
    subj = 'test';
    text = 'test';
    var result = await emailController.sendMail(email, subj, text);
    expect(result.status).toBe(true);
});

test('test sendMail with invalid data', async () => {
    email = 'q';
    subj = 'test';
    text = 'test';
    var result = await emailController.sendMail(email, subj, text);
    expect(result.status).toBe(false);
});
