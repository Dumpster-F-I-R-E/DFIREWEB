var crypto = require('crypto');

var Users = [
    {
        username: "root",
        password: "root"
    }
];

exports.Users = Users;
// This will hold the users and authToken related to users
var authTokens = {};

exports.authTokens = authTokens;

const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}

exports.authenticate = (username, password) => {

    let result = {valid:false, authToken:null};
    Users.filter(function(user){
       
        if(user.username === username && user.password === password){
          const authToken = generateAuthToken();

          // Store authentication token
          authTokens[authToken] = user;

          result = {
              valid: true,
              authToken: authToken
          };        
         
        }
     });

     return result;
}

exports.logout = (authToken) => {    
    authTokens[authToken] = null;
}


  
exports.requireAuth = (req, res, next) => {
      // Get auth token from the cookies
    const authToken = req.cookies['AuthToken'];
    req.user = authTokens[authToken];
  
    if (req.user) {
        next();
    } else {
        res.render('login', {
            message: 'Please login to continue',
            messageClass: 'alert-danger'
        });
    }
  };