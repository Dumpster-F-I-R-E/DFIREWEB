exports.redirect = (res, url, message) => {
    return res.redirect(url + '?error=' + encodeURIComponent(message));
};