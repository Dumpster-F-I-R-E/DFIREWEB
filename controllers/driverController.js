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
