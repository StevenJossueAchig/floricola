const connection = require('../db');

// Agregar un nuevo lote
const createLote = async (req, res) => {
    const { fecha_ingreso, observaciones, productos } = req.body;
    const fechaIngreso = new Date().toISOString().split("T")[0];
    // productos: [{ id_producto, cantidad_total, estado }]
    try {
        // 1. Insertar lote
        const [loteResult] = await connection.query(
            'INSERT INTO LOTE (FECHA_INGRESO, OBSERVACIONES) VALUES (?, ?)',
            [fechaIngreso, observaciones]
        );

        const id_lote = loteResult.insertId;

        // 2. Insertar cada producto en lote_producto
        for (const prod of productos) {
            await connection.query(
                `INSERT INTO LOTE_PRODUCTO 
                 (ID_LOTE, ID_PRODUCTO, CANTIDAD_TOTAL, ESTADO) 
                 VALUES (?, ?, ?, ?)`,
                [id_lote, prod.id_producto, prod.cantidad_total, prod.estado || 'Disponible']
            );
        }

        res.send({ status: "ok", data: { id_lote, productos } });
    } catch (error) {
        console.error("Error al crear el lote:", error);
        res.send({ status: "error", data: "Ocurrió un error" });
    }
};

// Obtener todos los lotes con sus productos
const getLotes = async (req, res) => {
    try {
        const [lotes] = await connection.query('SELECT * FROM LOTE');

        const lotesConProductos = await Promise.all(
            lotes.map(async (lote) => {
                const [productos] = await connection.query(
                    `SELECT lp.*, p.TIPO, p.VARIEDAD, p.COLOR, p.TOP_PICTURE
                    FROM LOTE_PRODUCTO lp
                    JOIN PRODUCTO p ON lp.ID_PRODUCTO = p.ID_PRODUCTO
                    WHERE lp.ID_LOTE = ?`,
                    [lote.ID_LOTE]
                );
                return { ...lote, productos };
            })
        );

        res.send({ status: "ok", data: lotesConProductos });
    } catch (error) {
        console.error("Error al obtener lotes:", error);
        res.send({ status: "error", data: "Ocurrió un error" });
    }
};

// Obtener un lote por ID
const getLoteById = async (req, res) => {
    const { id } = req.params;
    try {
        const [lotes] = await connection.query('SELECT * FROM LOTE WHERE ID_LOTE = ?', [id]);

        if (lotes.length === 0) {
            return res.send({ status: "error", data: "Lote no encontrado" });
        }

        const [productos] = await connection.query(
            `SELECT lp.*, p.TIPO, p.VARIEDAD, p.COLOR, p.TOP_PICTURE
            FROM LOTE_PRODUCTO lp
            JOIN PRODUCTO p ON lp.ID_PRODUCTO = p.ID_PRODUCTO
            WHERE lp.ID_LOTE = ?`,
            [id]
        );

        res.send({ status: "ok", data: { ...lotes[0], productos } });
    } catch (error) {
        console.error("Error al obtener lote por ID:", error);
        res.send({ status: "error", data: "Ocurrió un error" });
    }
};


//Eliminar lote y sus productos
const deleteLote = async (req, res) => {
    const { id } = req.params;
    try {
        await connection.query('DELETE FROM LOTE_PRODUCTO WHERE ID_LOTE = ?', [id]);
        await connection.query('DELETE FROM LOTE WHERE ID_LOTE = ?', [id]);
        res.send({ status: "ok", data: "Lote eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar el lote:", error);
        res.send({ status: "error", data: "Ocurrió un error" });
    }
};

const updateLote = async (req, res) => {
    const { id } = req.params; // ID_LOTE
    const { fecha_ingreso, observaciones, productos } = req.body;
    const fechaIngreso = fecha_ingreso.split("T")[0];

    try {
        // 1. Actualizar datos generales del lote
        await connection.query(
            'UPDATE LOTE SET FECHA_INGRESO = ?, OBSERVACIONES = ? WHERE ID_LOTE = ?',
            [fechaIngreso, observaciones, id]
        );

        // 2. Obtener productos actuales del lote
        const [existentes] = await connection.query(
            'SELECT ID_PRODUCTO FROM LOTE_PRODUCTO WHERE ID_LOTE = ?',
            [id]
        );
        const existentesMap = new Map(existentes.map(row => [row.ID_PRODUCTO, true]));

        // 3. Recorrer productos nuevos
        for (const prod of productos) {
            if (existentesMap.has(prod.id_producto)) {
                // Actualizar producto existente
                await connection.query(
                    `UPDATE LOTE_PRODUCTO 
                     SET CANTIDAD_TOTAL = ?, ESTADO = ? 
                     WHERE ID_LOTE = ? AND ID_PRODUCTO = ?`,
                    [prod.cantidad_total, prod.estado || 'Disponible', id, prod.id_producto]
                );
            } else {
                // Insertar producto nuevo
                await connection.query(
                    `INSERT INTO LOTE_PRODUCTO 
                     (ID_LOTE, ID_PRODUCTO, CANTIDAD_TOTAL, ESTADO) 
                     VALUES (?, ?, ?, ?)`,
                    [id, prod.id_producto, prod.cantidad_total, prod.estado || 'Disponible']
                );
            }
        }

        res.send({ status: "ok", data: `Lote ${id} actualizado correctamente.` });
    } catch (error) {
        console.error("Error al actualizar el lote:", error);
        res.send({ status: "error", data: "Ocurrió un error" });
    }
};

module.exports = {
    createLote,
    getLotes,
    getLoteById,
    updateLote,
    deleteLote
};
