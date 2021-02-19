const db = require('../database/db');

let pool = db.getPool();

function printErrors(error) {
    console.log(error);
    throw error;
}

exports.setLocation = async (userId, lat, lng) => {
    let sql =
        'INSERT INTO Drivers(UserID, Latitude, Longitude)' +
        ' VALUES(?,?,?) ON DUPLICATE KEY' +
        ' UPDATE Latitude=Values(Latitude), Longitude=Values(Longitude) ';
    
    await pool.execute(sql, [userId, lat, lng]).catch(printErrors);
};

exports.getDrivers = async () => {
    let sql = 'Select drv.UserID, Role, FirstName, LastName, Email, Latitude,'+
    'Longitude From Drivers RIGHT JOIN (SELECT * FROM Users '+
    ' WHERE Role=\'Driver\') drv  ON Drivers.UserID=drv.UserID;';
    var results = await pool.query(sql).catch(printErrors);
    if (results && results.length > 0 && results[0].length > 0) {
        return results[0];
    }
};

exports.clearRoutes = async () => {
    let sql =
        'UPDATE Dumpsters '+
        'SET DriverID = NULL '+
        'WHERE DriverID is not null; ';
    
    await pool.execute(sql).catch(printErrors);
};