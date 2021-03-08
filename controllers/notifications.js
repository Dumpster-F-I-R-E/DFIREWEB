const emailController = require('../controllers/emailController');

exports.notifyChangePassword = (email, name) => {
    let subj = 'Password has been changed';
    let text =
        'Dear ' +
        name +
        ',' +
        '<br> Your password has been updated. Please contact the admin for the new password.<br> Thanks, <br> DFIRE Team';
    emailController.sendMail(email, subj, text);
};

exports.notifyUpdateProfile = (email, name) => {
    let subj = 'Profile has been changed';
    let text =
        'Dear ' +
        name +
        ',' +
        '<br> Your information has been updated. <br> Thanks, <br> DFIRE Team';
    emailController.sendMail(email, subj, text);
};
