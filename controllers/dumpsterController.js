const db = require('../database/db');

exports.getDumpstersInfo = () => {
    return db.getDumpsterData();
};

exports.getDumpsterInfo = (id) => {
    return db.getDumpsterById(id);
};

exports.createDumpster = async (dumpster, data) => {
    let newDumpster = await db.addDumpster(data);
    return newDumpster;
};

exports.getDumpsters = async (DumpsterSerialNumber) => {
    let list = await db.getDumpstersSearch(DumpsterSerialNumber);
    if (!list) {
        list = [];
    }
    return list;
};