const db = require('../database/db');


exports.getReports = async () => {
       console.log("checking dumpster reports");
       let report = await db.getDumpsterReports();
       return report;
};