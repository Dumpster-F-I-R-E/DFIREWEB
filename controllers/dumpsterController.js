const db = require('../database/db');
let data = [
    {
        id: 1,
        lat: 51.05011,
        lng: -114.08529,
        fullness: 50,
        battery: 60,
    },
    {
        id: 2,
        lat: 51.05011,
        lng: -114.18529,
        fullness: 50,
        battery: 60,
    },
    {
        id: 3,
        lat: 51.15011,
        lng: -114.08529,
        fullness: 50,
        battery: 60,
    },
];

exports.getDumpstersInfo = () => {
    return db.getSensorData();
};

exports.getDumpsterInfo = (id) => {
    return db.getSensorById(id);
};
