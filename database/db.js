let mysql = require('mysql2/promise');
let fs = require('fs');
var path = require('path');
var connectionSettings = require("./db.conf.json");

exports.setConnectionSettings = (settings) => {
    connectionSettings = settings;
};

var pool = mysql.createPool(connectionSettings);

exports.changeDatabase = (settings) => {
    pool = mysql.createPool(settings);
}

function print_errors (error) {       
    if(error.code)
        console.log(error.code); 
    if(error.fatal)
        console.log(error.fatal);                  
    throw error;
}

exports.close_pool = async () => {
    await pool.end().catch(print_errors);
};



exports.createTables = async () => {
    
    var sqlPath = path.join(__dirname,  'sql', 'create_tables.sql');
    let sql = fs.readFileSync(sqlPath).toString();
    await pool.query(sql).catch(print_errors);
  
}



exports.dropTables = async () => {
    
    var sqlPath = path.join(__dirname,  'sql', 'drop_tables.sql');
    let sql = fs.readFileSync(sqlPath).toString();
    await pool.query(sql).catch(print_errors);
  
}


exports.getUserByUsername = async (username, callback) => {
   
    let sql = mysql.format("SELECT * FROM Users WHERE Username = ?", [username]);
    var results = await pool.query(sql).catch(print_errors); 
    if(results && results.length >0 && results[0].length >0){
        return results[0][0];
    }
     
}


exports.addCompany = async (company) =>{
    
    let sql = "insert into companies values(?, ?, ?, ?)";
    await pool.execute(sql, [company.CompanyID, company.Name, company.Address, company.Phone]).catch(print_errors);
};

exports.addUser = async (user) => {      
    let sql = "INSERT INTO users VALUES(?, ?, ?, ?, ?)";
    // let sql2 = mysql.format("INSERT INTO users VALUES('?', '?', '?', '?', '?')" , [1, user.Username, user.Password, user.Role, user.CompanyID] );
    // console.log(sql2);
    await pool.execute(sql, [user.UserID, user.Username, user.Password, user.Role, user.CompanyID]).catch(print_errors);

};