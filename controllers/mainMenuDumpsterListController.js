const db = require('../database/db');


exports.getReports = async () => {
       console.log("checking sensor reports");
       let report = await db.getSensorReports();
       return report;
};