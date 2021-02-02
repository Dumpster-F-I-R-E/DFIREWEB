const db = require('../database/db');

exports.getDumpstersInfo = () => {
    return db.getSensorData();
};

exports.getDumpsterInfo = (id) => {
    return db.getSensorById(id);
};

exports.addDumpster = async (dumpster, data) => {
    let newDumpster = await db.addSensor(data);
    console.log(newDumpster);
    return newDumpster;
};

exports.getDumpsters = async (SensorSerialNumber) => {
    let list = await db.getSensorsSearch(SensorSerialNumber);
    if (!list) {
        list = [];
    }
    return list;
};