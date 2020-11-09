
const auth = require('../controllers/authController');

test('authentication with valid credentials', () => {
    var user = {
            username: "u234",
            password: "12324sd"
        }
    
    auth.Users.push(user);
    const {valid, token} = auth.authenticate(user.username, user.password);
    expect(valid).toBe(true);

});

test('authentication with invalid credentials', () => {
    var user = {
            username: "u234",
            password: "12324sd"
        }
    
    var user2 = {
        username: "dsfs",
        password: "dsfs"
    }

    auth.Users.push(user);
    const {valid, token} = auth.authenticate(user2.username, user2.password);
    expect(valid).toBe(false);
    expect(token).toBe(undefined);

});


test('logout', () => {
    var token = "213342";
    auth.authTokens[token] = "user1";  
    auth.logout(token);  
    expect(auth.authTokens[token]).toBe(null);
   
});

test('requireAuth with valid login', () => {
    var token = "213342";
    auth.authTokens[token] = "user1";
    var flag = false;
    req = {};
    req.cookies = {};
    req.cookies['AuthToken'] = token;
    const mockNext = jest.fn(() => {flag = true;});
    const res = {
        render : (page, message) => {
            console.log(message);
            flag = false;
        }
    }
    auth.requireAuth(req, res, mockNext);
    expect(mockNext.mock.calls.length).toBe(1); 
    expect(flag).toBe(true);  
       
});


test('requireAuth without valid login', () => {
    var token = "213342";
    auth.authTokens[token] = null;
    var flag = false;
    req = {};
    req.cookies = {};
    req.cookies['AuthToken'] = token;
    const mockNext = jest.fn(() => {flag = true;});
    const res = {
        render : (page, message) => {
            console.log(message);
            flag = true;
        }
    }
    auth.requireAuth(req, res, mockNext);
    expect(mockNext.mock.calls.length).toBe(0); 
    expect(flag).toBe(true);  
       
});