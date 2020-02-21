const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'nodejs-complete',
    password: 'Bushki11er'
});

module.exports = pool.promise();