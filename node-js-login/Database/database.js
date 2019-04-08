var mysql = require('mysql');

var connection = mysql.createPool({
    connectionLimit: 100,
    host:'localhost',
    user:'root',
    password:'root',
    database:'node-js-login',
    port: 3306,
    debug: false,
    socketPath : '/Applications/MAMP/tmp/mysql/mysql.sock',
    multipleStatements: true
});

module.exports.connection = connection;