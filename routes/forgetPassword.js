var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
var fpc = require('../controllers/forgetPasswordController');

router.post('/', async function (req, res) {
   
    //Handling resetPass request from resetPassPage.ejs

    if(req.body.resetPass === "Update password"){
        console.log(req.body.newPass);
        console.log(req.body.cnfPass);
        console.log(req.body.user);
        if(req.body.newPass === req.body.cnfPass){
            await fpc.savePassword(req.body.user,req.body.newPass);
            console.log("password matched");
            res.render('login', {
                message: 'password has been changed'
            });
        }
        else {
             //need to add a message
             res.render('resetPassPage', {userId: req.body.user});
        }
    }
    //if route is 'send email'
    else{

    var email = req.body.email;
    console.log(email);
    

    crypto.randomBytes(32, async (err,buffer) => {
        
        if(err){
            console.log(err);
        }
        const token = buffer.toString("hex");
        let current = new Date();
        let expired = new Date(
            current.setDate(current.getDate() + 1) //1 day
        ); 
        
        let user = await fpc.getUser(email);
        
        if(!user) {
            console.log("cant find user"); //For debugging, take it out later
            res.render('getEmail', {
                message: "email does not exist, try again"
            });
        }
        else {
            console.log("User found"); //Take it out later
            await fpc.saveToken(user,token,expired);
            let result = await fpc.sendMail(email,token);
            console.log(result.status);
            console.log(result.message);
            res.render('login', {message:"check your email for reset link"}); //need to check what to do here
        }
    })

    }
    
});

router.get('/:token',async function(req,res) {
    console.log(req.params.token);
    let result = await fpc.checkToken(req.params.token);
    if(result.valid){
        
        console.log("token matched");
        console.log("user id is: " + result.uid);
        res.render('resetPassPage', {userId: result.uid});
    }
    else {
        console.log(result.message);
    }
});


module.exports = router;
