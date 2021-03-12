const db = require('../database/db');
const nodemailer = require('nodemailer');

exports.sendMail = async (email, subj, text) => {
    console.log('using email controller');
    let result = { status: false, message: 'Sending email' };
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'dfirecapstone@gmail.com',
            pass: 'capstone2021',
        },
    });

    let mailOptions = {
        from: 'dfirecapstone@gmail.com',
        to: email,
        subject: subj,
        html: `
            <p>${text}</p>
            `,
    };

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            //console.log('error occured');
            result = {
                status: false,
                message: 'An error occured',
            };
        } else {
            //console.log('Email sent');
            result = {
                status: true,
                message: 'Email sent',
            };
        }
    });
    return result;
};
