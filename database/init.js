#! /usr/bin/env node

const db = require('./db');

var seed_sensors = async () => {
    let sensor1 = {
        CompanyID: 1,
        SensorID: 1
    };
    let sensor2 = {
        CompanyID: 1,
        SensorID: 2
    };
    let sensor3 = {
        CompanyID: 1,
        SensorID: 3
    };
    await db.addSensor(sensor1);
    await db.addSensor(sensor2);
    await db.addSensor(sensor3);

    let report1 = {
        ReportID: 1,
        SensorID: 1,
        Longitude: -114.08529,
        Latitude: 51.05011,
        BatteryLevel: 50,
        FullnessLevel: 60,
        ErrorCode: 0
    };

    let report2 = {
        ReportID: 2,
        SensorID: 2,
        Longitude: -114.18529,
        Latitude: 51.05011,
        BatteryLevel: 50,
        FullnessLevel: 60,
        ErrorCode: 0
    };

    let report3 = {
        ReportID: 3,
        SensorID: 3,
        Longitude: -114.08529,
        Latitude: 51.15011,
        BatteryLevel: 50,
        FullnessLevel: 60,
        ErrorCode: 0
    };

    let report4 = {
        ReportID: 4,
        SensorID: 3,
        Longitude: -114.08529,
        Latitude: 51.15011,
        BatteryLevel: 50,
        FullnessLevel: 60,
        ErrorCode: 0
    };

    await db.storeSensorReport(report1);
    await db.storeSensorReport(report2);
    await db.storeSensorReport(report3);
    await db.storeSensorReport(report4);
    
};


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
		
        var admin_profile = {
            UserID: '1',
            FirstName: 'John',
            LastName: 'Doe',
            Address: '24 Ave Calgary, AB',
            Email: 'admin@abc.com',
            Phone: '403-343-3434',
            StaffID: '001'
        };
        
        await db.updateProfile(admin_profile);
        
        var depot = {
            DepotID: '1',
            Name: 'SW Dumpster',
            Address: 'Calgary, AB',
            CompanyID: 1,
        };
        await db.addDepot(depot);
        await seed_sensors();
		
        console.log('Closing connection');
        await db.closePool();
    }
};

init();
