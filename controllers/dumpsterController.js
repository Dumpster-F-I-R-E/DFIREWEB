const db = require('../database/db');

exports.getDumpstersInfo = () => {
    return db.getDumpsterData();
};

exports.getDumpsterInfo = (id) => {
    return db.getDumpsterById(id);
};

exports.createDumpster = async (data) => {
    let newDumpster = await db.addDumpster(data);
    return newDumpster;
};

exports.deleteDumpster = async (dumpsterId) => {
    await db.deleteDumpster(dumpsterId);
};

exports.getDumpsters = async (DumpsterSerialNumber) => {
    let list = await db.getDumpstersSearch(DumpsterSerialNumber);
    if (!list) {
        list = [];
    }
    return list;
};

exports.removeAssignedDriverFromDumpster = async (dumpsterId) => {
    await db.removeAssignedDriverFromDumpster(dumpsterId);
};

function findLineByLeastSquares(values_x, values_y) {
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var count = 0;

    /*
     * We'll use those variables for faster read/write access.
     */
    var x = 0;
    var y = 0;
    var values_length = values_x.length;

    if (values_length != values_y.length) {
        throw new Error(
            'The parameters values_x and values_y need to have same size!'
        );
    }

    /*
     * Nothing to do.
     */
    if (values_length === 0) {
        return [[], []];
    }

    /*
     * Calculate the sum for each of the parts necessary.
     */
    for (var v = 0; v < values_length; v++) {
        x = values_x[v];
        y = values_y[v];
        sum_x += x;
        sum_y += y;
        sum_xx += x * x;
        sum_xy += x * y;
        count++;
    }

    /*
     * Calculate m and b for the formular:
     * y = x * m + b
     */
    var m = (count * sum_xy - sum_x * sum_y) / (count * sum_xx - sum_x * sum_x);
    var b = sum_y / count - (m * sum_x) / count;

    return [m, b];
    // /*
    //  * We will make the x and y result line now
    //  */
    // var result_values_x = [];
    // var result_values_y = [];

    // for (var v = 0; v < values_length; v++) {
    //     x = values_x[v];
    //     y = x * m + b;
    //     result_values_x.push(x);
    //     result_values_y.push(y);
    // }

    // return [result_values_x, result_values_y];
}

exports.forcast = (dumpsterData) => {
    let i = -1;
    for (let j in dumpsterData) {
        if (dumpsterData[j].FullnessLevel < 1.0) {
            i = j;
            break;
        }
    }
    let slice = dumpsterData.slice(0, i);
    let data = slice.map((i) => {
        return {
            y: i.FullnessLevel,
            x: Date.parse(i.Time),
        };
    });
    let x = data.map((i) => i.x);
    let y = data.map((i) => i.y);

    let [m, b] = findLineByLeastSquares(x, y);
    // if(m < 0){
    //     let c = (-b) / m;
    //     m = -m;
    //     b = -m * c;
    // }
    let date = (100 - b) / m;
    return new Date(date);
};
