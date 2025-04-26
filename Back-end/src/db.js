const mysql = require('mysql2/promise');

// Configuración de la base de datos MySQL
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '1234',
    //password: '090712',
    database: 'floricola'
};

// Crear una conexión a la base de datos
const connection = mysql.createPool(dbConfig);

module.exports = connection;
