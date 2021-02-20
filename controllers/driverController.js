const db = require('../database/db');
const model = require('../database/driver');
const message = require('../controllers/messageController');

exports.getDrivers = async () => {
    let drivers = await model.getDrivers();
    return drivers;
};

exports.setDumpsters = async (driverId, dumpsters) => {
    if (dumpsters) {
        for (var i in dumpsters) {
            console.log("Assign Driver", driverId, dumpsters[i]);
            await db.setDriver(dumpsters[i], driverId);
        }
    }

};

exports.getDriver = async (dumpsterId) => {
    let driver = await db.getDriver(dumpsterId);
    return driver;
};

exports.getRoutes = async () => {
    let result = {
        Routes : {},
        Dumpsters: {}
    }; 
    let dumpsters = await db.getDumpsterData();
    for(var i in dumpsters){
        result.Dumpsters[dumpsters[i].DumpsterID] = dumpsters[i];
    }

    let driverData = await db.getRoutes();
    console.log(driverData);
    for(let i in driverData){
        let driver = driverData[i];
        if(driver.DriverID){
            result.Routes[driver.DriverID] = {
                Driver: driver
            };
            result.Routes[driver.DriverID]['Route'] = await exports.getRoute(driver.DriverID);
        }
    }
    
    return result;

};

const getDistance = (l1, l2) => {
    let distance = Math.sqrt((l1.Latitude - l2.Latitude) ** 2 + (l1.Longitude - l2.Longitude) ** 2);
    return distance;
};

const getClosestDepot = async (dumpsters) => {
    
    let depots = await db.getDepots();
    let distances = new Array(depots.length).fill(0);
    for (let index = 0; index < dumpsters.length; index++) {
        for (let i in depots) {
            distances[i] += getDistance(depots[i], dumpsters[index]);
        }
    };

    let minIndex = 0;
    for (let i in depots) {
        if (distances[i] < distances[minIndex])
            minIndex = i;
    };

    return depots[minIndex];
};

exports.getRoute = async (driverId) => {
    let route = await db.getRoute(driverId);
    var dumpsters = [];

    for (let index in route) {
        let s = await db.getDumpsterById(route[index].DumpsterID);
        dumpsters[index] = s[0];
        dumpsters[index]['DriverID'] = driverId;
    }

    let closestDepot = await getClosestDepot(dumpsters);
    
    return {
        Dumpsters: dumpsters,
        Depot: closestDepot
    };
};

exports.setLocation = async (driverId, lat, lng) => {
    await model.setLocation(driverId, lat,lng);

};

