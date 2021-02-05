const db = require('../database/db');

exports.getDrivers = async () => {
    let drivers = await db.getDrivers();
    return drivers;
};

exports.setDumpsters = async (driverId, sensors) => {

    if (sensors) {
        sensors.forEach(item => {
            db.setDriver(item, driverId);
        });
    }

};

exports.getDriver = async (sensorId) => {
    let driver = await db.getDriver(sensorId);
    return driver;
};

exports.getRoutes = async () => {
    let result = {
        Sensors: {},
        Drivers: {},
        Routes: {}
    };
    let sensorData = await db.getSensorData();
    sensorData.forEach(d => {
        result.Sensors[d.SensorID] = d;
    });
    let driverData = await db.getRoutes();
    console.log(driverData);
    driverData.forEach(d => {
        if (d.DriverID) {
            result.Drivers[d.DriverID] = d;
            if (!result.Routes[d.DriverID]) {
                result.Routes[d.DriverID] = [];
            }
            result.Routes[d.DriverID].push(d.SensorID);
        }

    });
    return result;

};

exports.getRoute = async (driverId) => {
    let route = await db.getRoute(driverId);
    var sensors = [];
    for (let index = 0; index < route.length; index++) {
        let s = await db.getSensorById(route[index].SensorID);
        sensors[index] = s[0];
    }
    return sensors;
};