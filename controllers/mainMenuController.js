const db = require('../database/db');

exports.getReports = async () => {
    console.log('checking dumpster reports');
    let report = await db.getLastHourReports();
    return report;
};

exports.getLowBattery = async () => {
    console.log('Checking low battery');
    let report = await db.getLowBattery();
    return report;
};

exports.getFullDumpsters =  async () => {
    console.log('Checking full dumpsters');
    let report = await db.getFullDumpsters();
    return report;
};