const db = require('../database/db');

exports.getDumpstersInfo = () => {
    return db.getDumpsterData();
};

exports.getDumpsterInfo = (id) => {
    return db.getDumpsterById(id);
};

exports.createDumpster = async (data) => {
    let newDumpster = await db.addDumpster(data);
    return newDumpster;
};

exports.deleteDumpster = async (dumpsterId) => {
    await db.deleteDumpster(dumpsterId);

};



exports.getDumpsters = async (DumpsterSerialNumber) => {
    let list = await db.getDumpstersSearch(DumpsterSerialNumber);
    if (!list) {
        list = [];
    }
    return list;
};