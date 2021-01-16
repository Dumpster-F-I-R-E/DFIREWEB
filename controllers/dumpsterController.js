const db = require('../database/db');

exports.getDumpstersInfo = () => {
    return db.getSensorData();
};

exports.getDumpsterInfo = (id) => {
    return db.getSensorById(id);
};

exports.addDumpster = async (sensor) => {

        let account = await db.createUser(profile);
        return account;

};