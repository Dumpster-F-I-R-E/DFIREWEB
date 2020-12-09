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
        // console.log(err);
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

exports.addCompany = async (company) => {
    let sql = 'INSERT INTO Companies values(?, ?, ?, ?)';
    await pool
        .execute(sql, [
            company.CompanyID,
            company.Name,
            company.Address,
            company.Phone,
        ])
        .catch(printErrors);
};

exports.addUser = async (user) => {
    let sql = 'INSERT INTO Users VALUES(?, ?, ?, ?, ?)';
    // let sql2 = mysql.format("INSERT INTO users VALUES('?', '?', '?', '?', '?')" , [1, user.Username, user.Password, user.Role, user.CompanyID] );
    // console.log(sql2);
    await pool
        .execute(sql, [
            user.UserID,
            user.Username,
            user.Password,
            user.Role,
            user.CompanyID,
        ])
        .catch(printErrors);
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
