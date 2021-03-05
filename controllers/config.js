let config = require('../config.json');

exports.getAPIKey = () => {
    return config['API_KEY'];
};
