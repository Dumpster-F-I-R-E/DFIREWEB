const db = require('../database/db');

const fs = require('fs');
const util = require('util');

// Convert fs.readFile into Promise version of same    
const readFile = util.promisify(fs.readFile);



exports.getImage = async (userid) => {
    let data = await db.getImage(userid);
    console.log("Data", data);
    if(!data){
        data = await readFile('public/images/profile.png');
      
    }else{
        data = data.Image;
    }
   
    return data;
};