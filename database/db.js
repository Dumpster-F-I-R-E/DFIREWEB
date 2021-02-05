let mysql = require('mysql2/promise');
let fs = require('fs');
var path = require('path');
var connectionSettings = require('./db.conf.json');

exports.setConnectionSettings = (settings) => {
    connectionSettings = settings;
};

var pool = mysql.createPool(connectionSettings);

exports.changeDatabase = (settings) => {
    pool = mysql.createPool(settings);
};

function printErrors(error) {
    console.log(error);
    throw error;
}

exports.checkConnection = async () => {
    let connection = null;
    try {
        connection = await pool.getConnection();
    } catch (err) {
        console.log(err);
    }

    return connection != null;
};

exports.closePool = async () => {
    await pool.end().catch(printErrors);
};

exports.createTables = async () => {
    var sqlPath = path.join(__dirname, 'sql', 'create_tables.sql');
    let sql = fs.readFileSync(sqlPath).toString();
    await pool.query(sql).catch(printErrors);
};

exports.dropTables = async () => {
    var sqlPath = path.join(__dirname, 'sql', 'drop_tables.sql');
    let sql = fs.readFileSync(sqlPath).toString();
    await pool.query(sql).catch(printErrors);
};

exports.getUserByUsername = async (username) => {
    let sql = mysql.format('SELECT * FROM Users WHERE Username = ?', [
        username,
    ]);
    var results = await pool.query(sql).catch(printErrors);
    if (results && results.length > 0 && results[0].length > 0) {
        return results[0][0];
    }
};

exports.getUserByUserID = async (userid) => {
    let sql = mysql.format('SELECT * FROM Users WHERE UserID = ?', [userid]);
    var results = await pool.query(sql).catch(printErrors);
    if (results && results.length > 0 && results[0].length > 0) {
        return results[0][0];
    }
};
exports.getUserByEmail = async (email) => {
    let sql = mysql.format('SELECT * FROM Users WHERE email = ?', [email]);
    var results = await pool.query(sql).catch(printErrors);
    if (results && results.length > 0 && results[0].length > 0) {
        return results[0][0];
    }
};
exports.updateProfile = async (profile) => {
    let sql =
        'UPDATE Users SET' +
        ' FirstName = ? ,' +
        ' LastName =  ? ,' +
        ' Address = ? , ' +
        ' Email = ? , ' +
        ' Phone = ? ,' +
        ' StaffID = ? ' +
        ' WHERE UserID=?;';
    await pool
        .execute(sql, [
            profile.FirstName,
            profile.LastName,
            profile.Address,
            profile.Email,
            profile.Phone,
            profile.StaffID,
            profile.UserID,
        ])
        .catch(printErrors);
};

exports.changePassword = async (userid, password) => {
    console.log('Change Password', userid, password);
    let sql = mysql.format('UPDATE Users SET Password=? WHERE UserID=?', [
        password,
        userid,
    ]);
    await pool.execute(sql).catch(printErrors);
};

exports.changeRole = async (userid, role) => {
    let sql = mysql.format('UPDATE Users SET Role=? WHERE UserID=?', [
        role,
        userid,
    ]);
    await pool.execute(sql).catch(printErrors);
};

exports.getProfile = async (id) => {
    let sql = mysql.format('SELECT * FROM Users WHERE UserID = ?', [id]);
    var results = await pool.query(sql).catch(printErrors);
    if (results && results.length > 0 && results[0].length > 0) {
        return results[0][0];
    }
};

exports.getRole = async (id) => {
    let sql = mysql.format('SELECT Role FROM Users WHERE UserID = ?', [id]);
    var results = await pool.query(sql).catch(printErrors);
    if (results && results.length > 0 && results[0].length > 0) {
        return results[0][0];
    }
};

exports.addCompany = async (company) => {
    let sql =
        'INSERT INTO Companies (`Name`, `Address`, `Phone`) values(?, ?, ?)';
    await pool
        .execute(sql, [company.Name, company.Address, company.Phone])
        .catch(printErrors);
};

exports.deleteUser = async (userid) => {
    let sql = 'DELETE FROM Users WHERE UserID=?';
    await pool.query(sql, [userid]).catch(printErrors);
};

exports.createUser = async (profile) => {
    profile.CompanyID = 1;
    console.log(profile);
    await exports.addUser(profile);
};

exports.addUser = async (user) => {
    let sql =
        'INSERT INTO Users' +
        '(Username, Password, Role, CompanyID, FirstName, LastName, Address, Email, Phone, StaffID)' +
        ' VALUES(?, ?, ?, ?, ?,?,?,?,?,?)';

    await pool
        .execute(sql, [
            user.Username,
            user.Password,
            user.Role,
            user.CompanyID,
            user.FirstName,
            user.LastName,
            user.Address,
            user.Email,
            user.Phone,
            user.StaffID,
        ])
        .catch(printErrors);
};

exports.deleteDepot = async (depotid) => {
    let sql = 'DELETE FROM Depots WHERE DepotID=?';
    await pool.query(sql, [depotid]).catch(printErrors);
};

exports.createDepot = async (depot) => {
    let sql = "SELECT MAX(DepotID) AS 'MaxID' FROM depots";
    var results = await pool.query(sql).catch(printErrors);
    if (results && results.length > 0 && results[0].length > 0) {
        console.log(results[0][0].MaxID);
        let val = results[0][0].MaxID;
        let depotid = val + 1;
        depot.DepotID = depotid;
        depot.CompanyID = 1;
        console.log(depot);
        await exports.addDepot(depot);
        return depot;
    }
};

exports.addDepot = async (depot) => {
    let sql =
        'INSERT INTO Depots (`Name`, `Address`, `CompanyID`) VALUES(?, ?, ?)';

    await pool
        .execute(sql, [depot.Name, depot.Address, depot.CompanyID])
        .catch(printErrors);
};

exports.addSensor = async (sensor) => {
    let sql =
        'INSERT INTO Sensors (`SensorSerialNumber`, `CompanyID`) VALUES(?, ?)';
    await pool
        .execute(sql, [sensor.SensorSerialNumber, sensor.CompanyID])
        .catch(printErrors);
};

exports.storeSensorReport = async (report) => {
    let sql =
        'INSERT INTO SensorReports (SensorID, Longitude, Latitude, BatteryLevel, FullnessLevel, ErrorCode, Time) VALUES(?, ?, ?, ?, ?,?,?)';
    await pool
        .execute(sql, [
            report.SensorID,
            report.Longitude,
            report.Latitude,
            report.BatteryLevel,
            report.FullnessLevel,
            report.ErrorCode,
            report.Time,
        ])
        .catch(printErrors);
};

exports.getSensorData = async () => {
    let sql =
        'SELECT  * ' +
        'FROM SensorReports,' +
        '(SELECT SensorID,ReportID, max(Time) as Time ' +
        'FROM SensorReports ' +
        'GROUP BY SensorID) latest ' +
        'WHERE SensorReports.ReportID=latest.ReportID ;';

    var results = await pool.query(sql).catch(printErrors);
    if (results && results.length > 0 && results[0].length > 0) {
        return results[0];
    }
};

exports.getSensorById = async (id) => {
    let sql =
        'SELECT * ' +
        ' FROM SensorReports' +
        ' WHERE SensorID=? ' +
        ' ORDER BY ReportID DESC;';

    var results = await pool.query(sql, id).catch(printErrors);
    if (results && results.length > 0 && results[0].length > 0) {
        return results[0];
    }
};

exports.getSensorReports = async () => {
  let sql =
        mysql.format('SELECT SensorID, Longitude, Latitude, BatteryLevel, FullnessLevel, Time FROM sensorreports  WHERE ReportID <= ?', ['5']);

     
    var results = await pool.query(sql).catch(printErrors);
    if (results && results.length > 0 && results[0].length > 0) {
        return results[0];
    }
};
exports.storeAuthToken = async (userId, token, expires) => {
    let sql =
        'INSERT INTO Sessions (`UserID`, `Token`, `ExpireDate`) VALUES(?, ?, ?)';

    await pool.execute(sql, [userId, token, expires]).catch(printErrors);
};

exports.getAuthToken = async (token) => {
    let sql = mysql.format('SELECT * FROM Sessions WHERE Token = ?', [token]);
    var results = await pool.query(sql).catch(printErrors);
    if (results && results.length > 0 && results[0].length > 0) {
        return results[0][0];
    }
};

exports.deleteAuthToken = async (token) => {
    let sql = mysql.format('DELETE FROM Sessions WHERE Token = ?', [token]);
    await pool.query(sql).catch(printErrors);
};

exports.runQuery = async (sql) => {
    await pool.query(sql).catch(printErrors);
};

exports.getUsers = async () => {
    let sql = 'SELECT FirstName, LastName, Email, Role' + ' FROM Users ';
    var results = await pool.query(sql).catch(printErrors);
    if (results && results.length > 0 && results[0].length > 0) {
        return results[0];
    }
};

exports.getDepotsSearch = async (name, address) => {
    let sql = 'SELECT DepotID, Name, Address' + ' FROM Depots ';
    if (name && name != '*') {
        sql += ' WHERE (Name LIKE ?)';
        sql = mysql.format(sql, [name]);
    }

    if (address && address != '*') {
        if (name && name != '*') {
            sql += ' AND Address Like ?';
        }
        sql += ' WHERE Address Like ?';
        sql = mysql.format(sql, [address]);
    }
    console.log(sql);
    var results = await pool.query(sql).catch(printErrors);
    if (results && results.length > 0 && results[0].length > 0) {
        return results[0];
    }
};

exports.getUsersSearch = async (name, role) => {
    let sql =
        'SELECT Users.UserID, FirstName, LastName, Email, Role' + ' FROM Users';
    if (name && name != '*') {
        sql += ' WHERE (FirstName LIKE ? OR LastName LIKE ?)';
        sql = mysql.format(sql, [name, name]);
    }

    if (role && role != '*') {
        if (name && name != '*') {
            sql += ' AND Role Like ?';
        }
        sql += ' WHERE Role Like ?';
        sql = mysql.format(sql, [role]);
    }
    console.log(sql);
    var results = await pool.query(sql).catch(printErrors);
    if (results && results.length > 0 && results[0].length > 0) {
        return results[0];
    }
};

exports.getImage = async (userid) => {
    let sql = mysql.format(
        'SELECT UserID,Image FROM ProfileImages WHERE UserID = ?',
        [userid]
    );
    var results = await pool.query(sql).catch(printErrors);
    if (results && results.length > 0 && results[0].length > 0) {
        return results[0][0];
    }
};

exports.changeImage = async (userId, image) => {
    let sql =
        'INSERT INTO ProfileImages(UserID, Image)' +
        ' VALUES(?,?) ON DUPLICATE KEY' +
        ' UPDATE Image=Values(Image)';
    console.log('ChangeImage DB', userId);
    await pool.execute(sql, [userId, image]).catch(printErrors);
};
exports.saveResetToken = async(user,token,expired) => {
    console.log(user.UserID, user.Username, token, expired);
    let sql =
    'INSERT INTO resetPassword (`userId`,`username`, `resetToken`, `resetExpired`) VALUES(?,?, ?, ?)';
    await pool.execute(sql, [user.UserID,user.Username, token, expired]).catch(printErrors);
    
};
exports.getUserFromResetToken = async(token) => {
    let sql = mysql.format('SELECT userId, resetToken, resetExpired FROM resetPassword WHERE resetToken = ?', [token]);
    var results = await pool.query(sql).catch(printErrors);
    if (results && results.length > 0 && results[0].length > 0) {
        return results[0][0];
    }
};