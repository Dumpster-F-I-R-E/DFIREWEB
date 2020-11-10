let mysql = require('mysql2');
let fs = require('fs');
var path = require('path');
var connectionSettings = require("./db.conf.json");
let connection = mysql.createConnection(connectionSettings);

const connect_err = function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected to the database ' + connection.threadId);
  };

const disconnect_err = function(err) {
    if (err) {
      console.error('error disconnecting: ' + err.stack);
      return;
    }
   
    console.log('Closed the database connection');
  };



exports.createTables = () => {
    // connection.connect(connect_err);
    var sqlPath = path.join(__dirname,  'sql', 'create_tables.sql');
    let sql = fs.readFileSync(sqlPath).toString();
    connection.query(sql, function (error, results, fields) {
        if(error){
            console.log(error.code); 
            console.log(error.fatal);
        }
        
      });
  
}

exports.getUserByUsername = (username, callback) => {
   
    connection.connect(connect_err);
    exports.createTables();
    let sql = mysql.format("SELECT * FROM Users WHERE Username = ?", [username]);
    connection.query(sql, function (error, results, fields) {
        if(error){
            console.log(error.code); 
            console.log(error.fatal);
        }
        
        console.log(results); 
        if (results && results.length > 0)
            callback(results[0]);
      });
     
}