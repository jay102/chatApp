const Sequelize = require('sequelize');
let db;
require('dotenv').config();
// Option 1: Passing parameters separately
console.log("env is", process.env.NODE_ENV);
console.log(process.env.DATABASE_URL)
if (process.env.NODE_ENV !== "development") {
    db = new Sequelize(`${process.env.DATABASE_URL}`, {
        dialect: 'postgres',

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
    );
} else {
    db = new Sequelize('local_dbname', 'local_dbuser', 'local_dbpass', {
        host: 'localhost',
        dialect: 'postgres',

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });
}


module.exports = db;
