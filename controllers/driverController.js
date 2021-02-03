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