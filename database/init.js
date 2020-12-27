#! /usr/bin/env node

const db = require('./db');

var init = async () => {
    console.log('Database Settings');
    var connectionSettings = require('./db.conf.json');
    console.log(connectionSettings);
    let connected = await db.checkConnection();
    if (!connected) {
        console.log('Run SQL command to grant user permissions');
        let sql =
            "CREATE USER 'dfireweb'@'localhost' IDENTIFIED BY 'password';\n" +
            'CREATE DATABASE IF NOT EXISTS dfireweb;\n' +
            "GRANT ALL PRIVILEGES ON dfireweb. * TO 'dfireweb'@'localhost'; \n";
        +'CREATE DATABASE IF NOT EXISTS dfireweb_test;\n' +
            "GRANT ALL PRIVILEGES ON dfireweb_test. * TO 'dfireweb'@'localhost';";
        console.log(sql);
        console.log('Error Initilizing database');
    } else {
        await db.dropTables();
        console.log('Initializing Tables..');
        await db.createTables();
        console.log('Creating user account root password=root');
        let sql =
            "INSERT INTO Companies VALUES(1, 'General', 'Calgary,AB', '403-454-3324');\n" +
            "INSERT INTO Users VALUES ('1', 'root', 'root', 'Admin', '1');";

        await db.runQuery(sql);
        console.log('Closing connection');
        await db.closePool();
    }
};

init();
