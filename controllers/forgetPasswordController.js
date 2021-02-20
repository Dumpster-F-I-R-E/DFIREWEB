const db = require('../database/db');
const emailController = require('../controllers/emailController')

exports.getUser = async(email) => {
   let user = await db.getUserByEmail(email);
   return user;
}
exports.saveToken = async(user,token,expired)=> {
    await db.saveResetToken(user,token,expired);
}
exports.checkToken = async(token) => {
    //check to make sure token exists, and did not expire
    let status = {uid: null, valid: false, message: "checking database"};
    let result = await db.getUserFromResetToken(token);
    console.log(result);
    if(!result) {
        console.log("token does not exist");
        status = {
            uid: null,
            valid: false,
            message: "token does not exist"
        };
    }
    else {
        let date1 = result.resetExpired;
        let date2 = new Date();
        console.log(date1);
        console.log(date2);
        if(date1>date2) {
            status = {
                uid: result.UserID,
                valid: true,
                message: "Success"
            };
        }
        else {
            status = {
                uid: result.userId,
                valid: false,
                message: "token expired"
            };
        }

    }
    return status;
}

exports.savePassword = async(userId,password) => {
    await db.changePassword(userId,password);
}
exports.sendMail = async(email,token) => {
    let text = "Please click the following <a href = http://localhost:3000/reset/" +token+ "> link </a> to reset your password";
    let subj = "Reset Link";
    let result = await emailController.sendMail(email,subj,text);
    return result;
}