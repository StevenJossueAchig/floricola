const connection = require('../db'); 

const createSucursal = async (req, res) => {
    const { nombre, direccion } = req.body;

    try {
        // Verificar si ya existe una sucursal con el mismo nombre
        const [existingSucursal] = await connection.query(
            'SELECT * FROM SUCURSAL WHERE NOMBRE = ?',
            [nombre]
        );

        if (existingSucursal.length > 0) {
            return res.send({ status: "error", data: "Ya existe una sucursal con el mismo nombre" });
        }

        // Obtener el último ID de la tabla SUCURSAL
        const [lastIdResult] = await connection.query('SELECT MAX(ID_SUCURSAL) AS lastId FROM SUCURSAL');
        const lastId = lastIdResult[0].lastId || 0;
        const newSucursalId = lastId + 1;

        // Insertar nueva sucursal
        await connection.query(
            'INSERT INTO SUCURSAL (ID_SUCURSAL, NOMBRE, DIRECCION) VALUES (?, ?, ?)',
            [newSucursalId, nombre, direccion]
        );

        res.send({ status: "ok", data: { ID_SUCURSAL: newSucursalId, NOMBRE: nombre, DIRECCION: direccion } });
    } catch (error) {
        console.error('Error durante la creación de sucursal:', error);
        res.send({ status: "error", data: "Ocurrió un error" });
    }
};

// Actualizar sucursal
const updateSucursal = async (req, res) => {
    const { id } = req.params;
    const { nombre, direccion } = req.body;

    try {
        // Verificar si ya existe una sucursal con el mismo nombre, excluyendo la sucursal actual
        const [existingSucursal] = await connection.query(
            'SELECT * FROM SUCURSAL WHERE NOMBRE = ? AND ID_SUCURSAL != ?',
            [nombre, id]
        );

        if (existingSucursal.length > 0) {
            return res.send({ status: "error", data: "Ya existe una sucursal con el mismo nombre" });
        }

        const [results] = await connection.query('SELECT * FROM SUCURSAL WHERE ID_SUCURSAL = ?', [id]);

        if (results.length > 0) {
            await connection.query(
                'UPDATE SUCURSAL SET NOMBRE = ?, DIRECCION = ? WHERE ID_SUCURSAL = ?',
                [nombre, direccion, id]
            );
            res.send({ status: "ok", data: { ID_SUCURSAL: id, NOMBRE: nombre, DIRECCION: direccion } });
        } else {
            res.send({ status: "error", data: "Sucursal no encontrada" });
        }
    } catch (error) {
        console.error('Error durante la actualización de sucursal:', error);
        res.send({ status: "error", data: "Ocurrió un error" });
    }
};

// Obtener sucursal por ID
const getSucursalById = async (req, res) => {
    const { id } = req.params;

    try {
        const [results] = await connection.query('SELECT * FROM SUCURSAL WHERE ID_SUCURSAL = ?', [id]);

        if (results.length > 0) {
            res.send({ status: "ok", data: results[0] });
        } else {
            res.send({ status: "error", data: "Sucursal no encontrada" });
        }
    } catch (error) {
        console.error('Error durante la obtención de sucursal:', error);
        res.send({ status: "error", data: "Ocurrió un error" });
    }
};

// Obtener todas las sucursales
const getAllSucursales = async (req, res) => {
    const { search } = req.query;
    const searchQuery = search ? `%${search}%` : '%';

    try {
        // Recuperar sucursales con búsqueda
        const [results] = await connection.query(
            'SELECT * FROM SUCURSAL WHERE NOMBRE LIKE ? OR DIRECCION LIKE ?',
            [searchQuery, searchQuery]
        );

        res.json({ status: "ok", data: results });
    } catch (error) {
        console.error('Error durante la obtención de sucursales:', error);
        res.json({ status: "error", data: "Ocurrió un error" });
    }
};




// Eliminar sucursal
const deleteSucursal = async (req, res) => {
    const { id } = req.params;

    try {
        const [results] = await connection.query('SELECT * FROM SUCURSAL WHERE ID_SUCURSAL = ?', [id]);

        if (results.length > 0) {
            await connection.query('DELETE FROM SUCURSAL WHERE ID_SUCURSAL = ?', [id]);
            res.send({ status: "ok", data: "Sucursal eliminada" });
        } else {
            res.send({ status: "error", data: "Sucursal no encontrada" });
        }
    } catch (error) {
        console.error('Error durante la eliminación de sucursal:', error);
        res.send({ status: "error", data: "Ocurrió un error" });
    }
};

module.exports = {
    createSucursal,
    getSucursalById,
    getAllSucursales,
    updateSucursal,
    deleteSucursal,
};
