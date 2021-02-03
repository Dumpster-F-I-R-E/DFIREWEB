const db = require('../database/db');

exports.getDrivers = async () => {
    let drivers = await db.getDrivers();
    return drivers;
};

exports.setDumpsters = async (driverId, sensors) =>{

    if(sensors){
        sensors.forEach(item => {
            db.setDriver(item, driverId);
        }); 
    }
    
};


exports.getRoutes = async () => {
    let routes = await db.getRoutes();
    let data = {};
    routes.forEach(item => {
        if(data[item.DriverID]){
            data[item.DriverID].push({
                lat: item.Latitude,
                lng: item.Longitude
            });
        }else{
            data[item.DriverID] = [{
                lat: item.Latitude,
                lng: item.Longitude
            }];
        }
    });
    const keys = Object.keys(data);
    let result = [];
    keys.forEach(i => {
        result.push({
            DriverID: i,
            Sensors: data[i]
        });
    });
    return result;

};