#! /usr/bin/env node

const db = require('./db');

var seedDepots = async () => {
    console.log('seedDepots');
    var depot1 = {
        Name: 'SW Dumpster',
        Address: 'Calgary, AB',
        Longitude: -114.08529,
        Latitude: 51.05011,
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

var seedDumpsters = async (num = 5) => {
    console.log('seedDumpsters');
    let dumpster = {
        dumpsterSerialNumber: 1,
        CompanyID: 1,
    };
    for (let index = 0; index < num; index++) {
        dumpster.DumpsterSerialNumber = index;
        await db.addDumpster(dumpster);
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

function getRandomBoolean(){
    return Math.random() > 0.5;
}

var seedDumpsterReports = async (numberOfDumpsters, num = 20) => {
    console.log('seedDumpsterReports');
    let report = {
        Longitude: -114.08529,
        Latitude: 51.05011,
        BatteryLevel: 50,
        FullnessLevel: 100,
        ErrorCode: 0,
        Time: new Date('2020-12-20 00:00:00'),
    };
    const distance = 0.002 * (numberOfDumpsters / 5);
    for (let index = 0; index < num; index++) {
        report.Time = new Date('2020-12-20');
        report.Time.setHours(report.Time.getHours() + index);
        report.DumpsterID = getRandomInt(1, numberOfDumpsters);
        report.FullnessLevel = report.FullnessLevel + getRandomInt(0, 100);
        
        report.BatteryLevel = getRandomInt(0, 100);
        if(getRandomBoolean()){
            report.Latitude += getRandomArbitrary(-distance, distance);
        }else{
            report.Longitude += getRandomArbitrary(-distance, distance);
        }        
        
        if(report.FullnessLevel > 100){
            report.FullnessLevel = 100;
            await db.storeDumpsterReport(report);
            report.FullnessLevel = 0;
        }else{
            await db.storeDumpsterReport(report);
        }
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
        await seedDepots();
        await seedDumpsters(20);
        await seedDumpsterReports(20,100);
        console.log('Closing connection');
        await db.closePool();
    }
};

init();
