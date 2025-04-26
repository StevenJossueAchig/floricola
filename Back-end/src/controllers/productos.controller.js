const connection = require('../db'); 

// Agregar un nuevo producto
const addProduct = async (req, res) => {
    const { tipo, variedad, color, descripcion, top_picture, side_picture, longitud_disponible_cm, tiempo_de_vida_dias, tamano_flor, espinas, petalos_por_flor, stock } = req.body;

    try {
        await connection.query(
            'INSERT INTO PRODUCTO (TIPO, VARIEDAD, COLOR, DESCRIPCION, TOP_PICTURE, SIDE_PICTURE, LONGITUD_DISPONIBLE_CM_, TIEMPO_DE_VIDA_DIAS_, TAMANO_FLOR, ESPINAS, PETALOS_POR_FLOR, STOCK) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [tipo, variedad, color, descripcion, top_picture, side_picture, longitud_disponible_cm, tiempo_de_vida_dias, tamano_flor, espinas, petalos_por_flor, stock]
        );
        res.send({ status: "ok" });
    } catch (error) {
        console.error('Error durante la adición del producto:', error);
        res.send({ status: "error" });
    }
};

// Obtener todos los productos con búsqueda opcional
const getAllProducts = async (req, res) => {
    const { search } = req.query;
    const searchQuery = search ? `%${search}%` : '%';

    try {
        const [results] = await connection.query(
            'SELECT * FROM PRODUCTO WHERE TIPO LIKE ? OR VARIEDAD LIKE ? OR COLOR LIKE ?',
            [searchQuery, searchQuery, searchQuery]
        );
        res.json({ status: "ok", data: results });
    } catch (error) {
        console.error('Error durante la recuperación de productos:', error);
        res.json({ status: "error", data: "Ocurrió un error" });
    }
};

// Obtener un producto por ID
const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const [results] = await connection.query('SELECT * FROM PRODUCTO WHERE ID_PRODUCTO = ?', [id]);
        const product = results[0];

        if (product) {
            res.send({ status: "ok", data: product });
        } else {
            res.send({ status: "error", data: "Producto no encontrado" });
        }
    } catch (error) {
        console.error('Error durante la recuperación del producto:', error);
        res.send({ status: "error", data: "Ocurrió un error" });
    }
};

// Actualizar un producto por ID
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { tipo, variedad, color, descripcion, top_picture, side_picture, longitud_disponible_cm, tiempo_de_vida_dias, tamano_flor, espinas, petalos_por_flor, stock } = req.body;

    try {
        await connection.query(
            'UPDATE PRODUCTO SET TIPO = ?, VARIEDAD = ?, COLOR = ?, DESCRIPCION = ?, TOP_PICTURE = ?, SIDE_PICTURE = ?, LONGITUD_DISPONIBLE_CM_ = ?, TIEMPO_DE_VIDA_DIAS_ = ?, TAMANO_FLOR = ?, ESPINAS = ?, PETALOS_POR_FLOR = ?, STOCK = ? WHERE ID_PRODUCTO = ?',
            [tipo, variedad, color, descripcion, top_picture, side_picture, longitud_disponible_cm, tiempo_de_vida_dias, tamano_flor, espinas, petalos_por_flor, stock, id]
        );
        res.send({ status: "ok" });
    } catch (error) {
        console.error('Error durante la actualización del producto:', error);
        res.send({ status: "error" });
    }
};

// Eliminar un producto por ID
const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        await connection.query('DELETE FROM PRODUCTO WHERE ID_PRODUCTO = ?', [id]);
        res.send({ status: "ok", data: "Eliminado" });
    } catch (error) {
        console.error('Error durante la eliminación del producto:', error);
        res.send({ status: "error", data: "Ocurrió un error" });
    }
};

module.exports = {
    addProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
