const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const connection = require('../db'); 

const JWT_SECRET = "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";



// Registro de usuario
const registerUser = async (req, res) => {
    const { nombres, apellidos, telefono, correo_electronico, rol, usuario, contrasena, sucursalId } = req.body;

    try {
        const encryptedPassword = await bcrypt.hash(contrasena, 10);

        // Verificar si el nombre de usuario o correo ya existen
        const [userByUsername] = await connection.query('SELECT * FROM USUARIO WHERE USUARIO = ?', [usuario]);
        const [userByEmail] = await connection.query('SELECT * FROM USUARIO WHERE CORREO_ELECTRONICO = ?', [correo_electronico]);

        if (userByUsername.length > 0) {
            return res.json({ error: "El nombre de usuario ya existe" });
        }

        if (userByEmail.length > 0) {
            return res.json({ error: "El correo electrónico ya se encuentra registrado" });
        }

        // Obtener el último ID de la tabla USUARIO
        const [lastIdResult] = await connection.query('SELECT MAX(ID_USUARIO) AS lastId FROM USUARIO');
        const lastId = lastIdResult[0].lastId || 0;
        const newUserId = lastId + 1;

        // Insertar el nuevo usuario
        await connection.query(
            'INSERT INTO USUARIO (ID_USUARIO, ID_SUCURSAL,NOMBRES, APELLIDOS, TELEFONO, CORREO_ELECTRONICO, ROL, USUARIO, CONTRASENA) VALUES (?, ? , ?, ?, ?, ?, ?, ?, ?)',
            [newUserId,sucursalId, nombres, apellidos, telefono, correo_electronico, rol, usuario, encryptedPassword]
        );

        res.send({ status: "ok" });
    } catch (error) {
        console.error('Error durante el registro:', error);
        res.send({ status: "error" });
    }
};

// Inicio de sesión de usuario
const loginUser = async (req, res) => {
    const { usuario, contrasena } = req.body;

    try {
        const [results] = await connection.query('SELECT * FROM USUARIO WHERE USUARIO = ?', [usuario]);
        const user = results[0];

        if (!user) {
            return res.json({ error: "Usuario no encontrado" });
        }

        if (await bcrypt.compare(contrasena, user.CONTRASENA)) {
            const token = jwt.sign({ id: user.ID_USUARIO }, JWT_SECRET, { expiresIn: "15m" });
            return res.json({ status: "ok", data: token, userType: user.ROL });
        }

        res.json({ status: "error", error: "Contraseña incorrecta" });
    } catch (error) {
        res.json({ status: "error", error: "Ocurrió un error" });
    }
};

// Obtener datos del usuario autenticado
const getUserData = async (req, res) => {
    const { token } = req.body;
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        const [user] = await connection.query('SELECT * FROM USUARIO WHERE ID_USUARIO = ?', [userId]);

        if (user.length > 0) {
            res.send({ status: "ok", data: user[0] });
        } else {
            res.send({ status: "error", data: "Usuario no encontrado" });
        }
    } catch (error) {
        res.send({ status: "error", data: "Token expirado o inválido" });
    }
};



// Eliminar usuario
const deleteUser = async (req, res) => {
    const { userid } = req.body;
    try {
        await connection.query('DELETE FROM USUARIO WHERE ID_USUARIO = ?', [userid]);

        res.send({ status: "Ok", data: "Eliminado" });
    } catch (error) {
        res.send({ status: "error", data: "Ocurrió un error" });
    }
};

// Obtener todos los usuarios con búsqueda opcional
const getAllUsers = async (req, res) => {
    const { search } = req.query;
    const searchQuery = search ? `%${search}%` : '%';

    try {
        // Recuperar usuarios con búsqueda
        const [results] = await connection.query(
            'SELECT * FROM USUARIO WHERE NOMBRES LIKE ? OR CORREO_ELECTRONICO LIKE ?',
            [searchQuery, searchQuery]
        );

        res.json({ status: "ok", data: results });
    } catch (error) {
        console.error('Error durante la recuperación de usuarios:', error);
        res.json({ status: "error", data: "Ocurrió un error" });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserData,
    deleteUser,
    getAllUsers, // Asegúrate de exportar el nuevo método
};

