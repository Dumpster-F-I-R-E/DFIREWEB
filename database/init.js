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
        
		let company = {
            CompanyID: 1,
            Name: 'General',
            Address: 'Calgary,AB',
            Phone: '345-343-3432',
        };
        await db.addCompany(company);
        
		var admin = {
            UserID: '1',
            Username: 'root',
            Password: 'root',
            Role: 'Admin',
            CompanyID: 1,
        };
		var manager = {
            UserID: '2',
            Username: 'manager',
            Password: 'manager',
            Role: 'Manager',
            CompanyID: 1,
        };
		var driver = {
            UserID: '3',
            Username: 'driver',
            Password: 'driver',
            Role: 'Driver',
            CompanyID: 1,
        };
        await db.addUser(admin);
		await db.addUser(manager);
		await db.addUser(driver);
		
		
		
        var depot = {
            DepotID: '1',
            Name: 'SW Dumpster',
            Address: 'Calgary, AB',
            CompanyID: 1,
        };
        await db.addDepot(depot);
		
        console.log('Closing connection');
        await db.closePool();
    }
};

init();
