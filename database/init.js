#! /usr/bin/env node

const db = require('./db');

var seedDepots = async () => {
    console.log('seedDepots');
    var depot1 = {
        Name: 'SW Dumpster',
        Address: 'Calgary, AB',
        CompanyID: 1,
    };
    await db.addDepot(depot1);
};

var seedUsers = async () => {
    console.log('seedUsers');
    var admin = {
        Username: 'root',
        Password: 'root',
        Role: 'Admin',
        CompanyID: 1,
        FirstName: 'John',
        LastName: 'Doe',
        Address: 'Calgary,AB',
        Email: 'admin@abc.com',
        Phone: '403-233-3333',
        StaffID: '1',
    };

    var manager = {
        Username: 'manager',
        Password: 'manager',
        Role: 'Manager',
        CompanyID: 1,
        FirstName: 'John',
        LastName: 'Doe',
        Address: 'Calgary,AB',
        Email: 'admin@abc.com',
        Phone: '403-233-3333',
        StaffID: '1',
    };
    var driver = {
        Username: 'driver',
        Password: 'driver',
        Role: 'Driver',
        CompanyID: 1,
        FirstName: 'John',
        LastName: 'Doe',
        Address: 'Calgary,AB',
        Email: 'admin@abc.com',
        Phone: '403-233-3333',
        StaffID: '1',
    };
    await db.addUser(admin);
    await db.addUser(manager);
    await db.addUser(driver);
};

var seedCompanies = async () => {
    console.log('seedCompanies');
    let company = {
        Name: 'General',
        Address: 'Calgary,AB',
        Phone: '345-343-3432',
    };
    await db.addCompany(company);
};

var seedSensors = async (num = 5) => {
    console.log('seedSensors');
    let sensor = {
        SensorSerialNumber: 1,
        CompanyID: 1,
    };
    for (let index = 0; index < num; index++) {
        sensor.SensorSerialNumber = index;
        await db.addSensor(sensor);
    }
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

var seedSensorReports = async (numSensors, num = 20) => {
    console.log('seedSensorReports');
    let report = {
        SensorID: 1,
        Longitude: -114.08529,
        Latitude: 51.05011,
        BatteryLevel: 50,
        FullnessLevel: 100,
        ErrorCode: 0,
        Time: new Date('2020-12-20 00:00:00'),
    };
    const distance = 0.1 * (numSensors / 5);
    for (let index = 0; index < num; index++) {
        report.Time = new Date('2020-12-20 00:00:00');
        report.Time.setHours(report.Time.getHours() + index);
        report.SensorID = getRandomInt(1, numSensors);
        report.FullnessLevel = getRandomInt(0, 100);
        report.BatteryLevel = getRandomInt(0, 100);
        report.Latitude += getRandomArbitrary(-distance, distance);
        report.Longitude += getRandomArbitrary(-distance, distance);
        await db.storeSensorReport(report);
    }
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

        await seedCompanies();

        await seedUsers();
        // var adminProfile = {
        //     UserID: '1',
        //     FirstName: 'John',
        //     LastName: 'Doe',
        //     Address: '24 Ave Calgary, AB',
        //     Email: 'admin@abc.com',
        //     Phone: '403-343-3434',
        //     StaffID: '001',
        // };

        // await db.updateProfile(adminProfile);

        await seedDepots();

        await seedSensors(20);

        await seedSensorReports(20,100);

        console.log('Closing connection');
        await db.closePool();
    }
};

init();
