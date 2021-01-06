#! /usr/bin/env node

const db = require('./db');

var seedSensors = async () => {
    let sensor1 = {
        CompanyID: 1,
        SensorID: 1,
    };
    let sensor2 = {
        CompanyID: 1,
        SensorID: 2,
    };
    let sensor3 = {
        CompanyID: 1,
        SensorID: 3,
    };
    await db.addSensor(sensor1);
    await db.addSensor(sensor2);
    await db.addSensor(sensor3);

    let report1 = {
        SensorID: 1,
        Longitude: -114.08529,
        Latitude: 51.05011,
        BatteryLevel: 50,
        FullnessLevel: 60,
        ErrorCode: 0,
        Time: new Date('2020-12-20 05:00:00'),
    };

    let report2 = {
        SensorID: 2,
        Longitude: -114.18529,
        Latitude: 51.05011,
        BatteryLevel: 50,
        FullnessLevel: 60,
        ErrorCode: 0,
        Time: new Date('2020-12-20 05:00:00'),
    };

    let report3 = {
        SensorID: 3,
        Longitude: -114.08529,
        Latitude: 51.15011,
        BatteryLevel: 50,
        FullnessLevel: 60,
        ErrorCode: 0,
        Time: new Date('2020-12-20 05:00:00'),
    };

    let report4 = {
        SensorID: 3,
        Longitude: -114.08529,
        Latitude: 51.15011,
        BatteryLevel: 50,
        FullnessLevel: 70,
        ErrorCode: 0,
        Time: new Date('2020-12-20 06:00:00'),
    };


    await db.storeSensorReport(report1);
    await db.storeSensorReport(report2);
    await db.storeSensorReport(report3);
    await db.storeSensorReport(report4);
    report4.FullnessLevel = 10;
    report4.Time = new Date('2020-12-20 08:00:00');
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
            FirstName:'John',
            LastName: 'Doe',
            Address: 'Calgary,AB',
            Email: 'admin@abc.com',
            Phone: '403-233-3333',
            StaffID: '1'
        };

        var manager = {
            UserID: '2',
            Username: 'manager',
            Password: 'manager',
            Role: 'Manager',
            CompanyID: 1,
            FirstName:'John',
            LastName: 'Doe',
            Address: 'Calgary,AB',
            Email: 'admin@abc.com',
            Phone: '403-233-3333',
            StaffID: '1'
        };
        var driver = {
            UserID: '3',
            Username: 'driver',
            Password: 'driver',
            Role: 'Driver',
            CompanyID: 1,
            FirstName:'John',
            LastName: 'Doe',
            Address: 'Calgary,AB',
            Email: 'admin@abc.com',
            Phone: '403-233-3333',
            StaffID: '1'
        };
        await db.addUser(admin);
        await db.addUser(manager);
        await db.addUser(driver);

        var adminProfile = {
            UserID: '1',
            FirstName: 'John',
            LastName: 'Doe',
            Address: '24 Ave Calgary, AB',
            Email: 'admin@abc.com',
            Phone: '403-343-3434',
            StaffID: '001',
        };

        await db.updateProfile(adminProfile);

        var depot = {
            DepotID: '1',
            Name: 'SW Dumpster',
            Address: 'Calgary, AB',
            CompanyID: 1,
        };
        await db.addDepot(depot);
        await seedSensors();

        console.log('Closing connection');
        await db.closePool();
    }
};

init();
