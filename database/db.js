let mysql = require('mysql2/promise');
let fs = require('fs');
var path = require('path');
var auth = require('../controllers/authController');
var connectionSettings = require('./db.conf.json');

exports.setConnectionSettings = (settings) => {
    connectionSettings = settings;
};

var pool = mysql.createPool(connectionSettings);

exports.getPool = () => {
    return pool;
};

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
    let hash = auth.hashPassword(password);
    let sql = mysql.format('UPDATE Users SET Password=? WHERE UserID=?', [
        hash,
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

exports.getNumberOfAssignedDumpsterForUserId = async (id) => {
    let sql = mysql.format('SELECT COUNT(DriverID) AS DumpsterCount FROM dfireweb.dumpsters WHERE DriverID = ?', [id]);
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
    let hash = auth.hashPassword(user.Password);
    await pool
        .execute(sql, [
            user.Username,
            hash,
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

exports.addDepot = async (depot) => {
    let sql =
        'INSERT INTO Depots (`Name`, `Address`, `Latitude`, `Longitude`, `CompanyID`) VALUES(?, ?, ?, ? ,?)';

    await pool
        .execute(sql, [depot.Name, depot.Address, depot.Latitude, depot.Longitude, depot.CompanyID])
        .catch(printErrors);

    let sql2 = 'SELECT * FROM `Depots` WHERE DepotID=(SELECT MAX(DepotID) FROM `Depots`);';
    var results = await pool.query(sql2).catch(printErrors);
    if (results && results.length > 0 && results[0].length > 0) {
        return results[0][0];
    }

};

exports.addDumpster = async (dumpster) => {
    let sql =
        'INSERT INTO dumpsters (`DumpsterSerialNumber`, `CompanyID`) VALUES(?, ?)';
    await pool
        .execute(sql, [dumpster.DumpsterSerialNumber, dumpster.CompanyID])
        .catch(printErrors);

    let sql2 = 'SELECT * FROM `Dumpsters` WHERE DumpsterID=(SELECT MAX(DumpsterID) FROM `Dumpsters`);';
    var results = await pool.query(sql2).catch(printErrors);
    if (results && results.length > 0 && results[0].length > 0) {
        return results[0][0];
    }

};

exports.deleteDumpster = async (dumpsterId) => {
    let sql = 'DELETE FROM Dumpsters WHERE DumpsterID=?';
    await pool.query(sql, [dumpsterId]).catch(printErrors);
};

exports.storeDumpsterReport = async (report) => {
    let sql =
        'INSERT INTO DumpsterReports (DumpsterID, Longitude, Latitude, BatteryLevel, FullnessLevel, ErrorCode, Time) VALUES(?, ?, ?, ?, ?,?,?)';
    await pool
        .execute(sql, [
            report.DumpsterID,
            report.Longitude,
            report.Latitude,
            report.BatteryLevel,
            report.FullnessLevel,
            report.ErrorCode,
            report.Time,
        ])
        .catch(printErrors);
};

exports.getDumpsterData = async () => {
    let sql =
        'SELECT  * ' +
        'FROM DumpsterReports,' +
        '(SELECT DumpsterID,max(ReportID) as ReportID ' +
        'FROM DumpsterReports ' +
        'GROUP BY DumpsterID) latest ' +
        'WHERE DumpsterReports.ReportID=latest.ReportID ;';

    var results = await pool.query(sql).catch(printErrors);
    if (results && results.length > 0 && results[0].length > 0) {
        return results[0];
    }
};

exports.getDumpsterById = async (id) => {
    let sql =
        'SELECT * ' +
        ' FROM DumpsterReports' +
        ' WHERE DumpsterID=? ' +
        ' ORDER BY ReportID DESC;';

    var results = await pool.query(sql, id).catch(printErrors);
    if (results && results.length > 0 && results[0].length > 0) {
        return results[0];
    }
};

exports.getDumpsterReports = async () => {
    let sql =
        mysql.format('SELECT DumpsterID, Longitude, Latitude, BatteryLevel, FullnessLevel, Time FROM dumpsterReports ORDER BY ReportID DESC limit 5');

    var results = await pool.query(sql).catch(printErrors);
    if (results && results.length > 0 && results[0].length > 0) {
        return results[0];
    }
};
exports.getLastHourReports = async() => {
    let sql = 'Select DumpsterID, Longitude, Latitude, BatteryLevel, FullnessLevel, Time' +
                ' From dumpsterreports'+
                ' where time>=date_sub((select max(time) from dumpsterreports),interval 6 hour) order by reportID desc;';
    

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

exports.getDepots = async () => {
    let sql = 'SELECT * FROM Depots ';
    var results = await pool.query(sql).catch(printErrors);
    if (results && results.length > 0 && results[0].length > 0) {
        return results[0];
    }
};

exports.getDepotsSearch = async (name, address) => {
    let sql = 'SELECT DepotID, Name, Address' + ' FROM Depots ';
    if (name && name != '*') {
        sql += 'WHERE Name LIKE ?';
        sql = mysql.format(sql, [name]);
    }

    if (address && address != '*') {
        if (name && name != '*') {
            sql += ' AND Address Like ?';
        }
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
        'SELECT UserID, FirstName, LastName, Email, Role, DumpsterCount ' +
        'FROM Users Drivers ' + 
        'LEFT JOIN (SELECT DriverID, COUNT(DriverID) AS DumpsterCount FROM dumpsters GROUP BY DriverID) Dumpsters ' +
        'ON Drivers.UserID = Dumpsters.DriverID ';
    if (name && name != '*') {
        sql += ' WHERE (FirstName LIKE ? OR LastName LIKE ?)';
        sql = mysql.format(sql, [name, name]);
    }

    if (role && role != '*') {
        if (name && name != '*') {
            sql += ' AND Role Like ?';
        }else{
            sql += ' WHERE Role Like ?';
        }
        
        sql = mysql.format(sql, [role]);
    }
    console.log(sql);
    var results = await pool.query(sql).catch(printErrors);
    if (results && results.length > 0 && results[0].length > 0) {
        return results[0];
    }
};

exports.getDumpstersSearch = async (DumpsterSerialNumber) => {
    let sql = `SELECT dumpsters.DumpsterID, dumpsters.DumpsterSerialNumber, users.UserID AS DriverID, users.FirstName, users.LastName FROM Dumpsters LEFT JOIN users ON dumpsters.DriverID = users.UserID`;
    if (DumpsterSerialNumber && DumpsterSerialNumber != '*') {
        sql += ' WHERE (DumpsterSerialNumber LIKE ?)';
        sql = mysql.format(sql, [DumpsterSerialNumber]);
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



exports.getRoutes = async () => {
    let sql = 'SELECT DumpsterID,DriverID,FirstName,LastName FROM Dumpsters JOIN Users ON DriverID=UserID';
    var results = await pool.query(sql).catch(printErrors);
    if (results && results.length > 0 && results[0].length > 0) {
        return results[0];
    }
};

exports.getRoute = async (driverId) => {
    let sql = 'SELECT DumpsterID,DriverID FROM Dumpsters WHERE DriverID=?';
    var results = await pool.query(sql, [driverId]).catch(printErrors);
    if (results && results.length > 0 && results[0].length > 0) {
        return results[0];
    }
};

exports.getDriver = async (DumpsterId) => {
    let sql = 'SELECT DriverID,FirstName,LastName FROM Dumpsters JOIN Users ON DriverID=UserID WHERE DumpsterID=?';
    var results = await pool.query(sql, [DumpsterId]).catch(printErrors);
    if (results && results.length > 0 && results[0].length > 0) {
        return results[0][0];
    }
};
exports.getDriverByName = async(driverName) => {
    // let sql = 'select * from users'
};
exports.getMessages = async(driverID) => {
    let sql = 'Select * from driverMessages where UserID = ? order by MessageID desc';

    var results = await pool.query(sql, [driverID]).catch(printErrors);
    if (results && results.length > 0 && results[0].length > 0) {
        return results[0];
    }
};

exports.addMessage = async(userID, message) => {
    let sql = mysql.format('insert into driverMessages(userID,Message,Time,Status) values (?,?,current_timestamp,"unread")',[userID,message]);
    await pool.execute(sql).catch(printErrors);
};
exports.updateMessageStatus = async(driverId, status) => {
    let sql = mysql.format('Update driverMessages SET Status = ? where userID = ?', [status,driverId]);
    await pool.execute(sql).catch(printErrors);

}
exports.setDriver = async (dumpsterId, driverId) => {
    let sql =
        'UPDATE Dumpsters SET' +
        ' DriverID = ? ' +
        ' WHERE DumpsterID=?;';

    await pool
        .execute(sql, [driverId, dumpsterId]).catch(printErrors);
};

exports.saveResetToken = async (user, token, expired) => {
    console.log(user.UserID, user.Username, token, expired);
    let sql =
        'INSERT INTO resetPassword (`UserID`,`username`, `resetToken`, `resetExpired`) VALUES(?,?, ?, ?)';
    await pool.execute(sql, [user.UserID, user.Username, token, expired]).catch(printErrors);

};
exports.getUserFromResetToken = async (token) => {
    let sql = mysql.format('SELECT UserID, resetToken, resetExpired FROM resetPassword WHERE resetToken = ?', [token]);
    var results = await pool.query(sql).catch(printErrors);
    if (results && results.length > 0 && results[0].length > 0) {
        return results[0][0];
    }
};

exports.removeAssignedDriverFromDumpster = async (dumpsterId) => {
    let sql = 'UPDATE dumpsters SET DriverID = NULL WHERE DumpsterID = ?';
    await pool.execute(sql, [dumpsterId]).catch(printErrors);
};

exports.removeAllAssignedDumpstersFromDriver = async (driverId) => {
    let sql = 'UPDATE dumpsters SET DriverID = NULL WHERE DriverID = ?';
    await pool.execute(sql, [driverId]).catch(printErrors);
};

exports.getNumberOfDepots = async () => {
    let sql = 'SELECT COUNT(DepotID) AS Count FROM depots';
    console.log(sql);
    var results = await pool.query(sql).catch(printErrors);
    return results[0][0];
};

exports.getNumberOfDepots = async () => {
    let sql = 'SELECT COUNT(DumpsterID) AS Count FROM dumpsters';
    console.log(sql);
    var results = await pool.query(sql).catch(printErrors);
    return results[0][0];
};

exports.getNumberOfDumpstersWithDrivers = async () => {
    let sql = 'SELECT COUNT(DriverID) AS Count FROM dfireweb.dumpsters';
    console.log(sql);
    var results = await pool.query(sql).catch(printErrors);
    return results[0][0];
};