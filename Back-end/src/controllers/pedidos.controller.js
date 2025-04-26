const { promises } = require('dns');
const connection = require('../db');

const createPedido = async (req,res) =>{
    const {id_usuario,fecha_pedido,fecha_entrega,incluye} = req.body;
    
    try{
        await connection.query(
            'INSERT INTO PEDIDO (ID_USUARIO,FECHA_PEDIDO,FECHA_ENTREGA,ESTADO) VALUES (?,?,?,"PENDIENTE")',
            [id_usuario,new Date(fecha_pedido).toISOString().slice(0, 19).replace('T', ' '),new Date(fecha_entrega).toISOString().slice(0, 19).replace('T', ' ')]
        );

        const [createdPedido] = await connection.query('SELECT MAX(ID_PEDIDO) AS lastId FROM PEDIDO');
        const lastId = createdPedido[0].lastId || 1;

        incluye.map(async (prod) =>{
            const productoId = prod.producto.id_producto;
            const productoPedidoId = `${productoId}${lastId}`;
            console.log(prod)
            await connection.query(
                'INSERT INTO INCLUYE (ID_PRODUCTO,ID_PEDIDO,CANTIDAD,ID_PRODUCTO_PEDIDO) VALUES (?,?,?,?)',
                [prod.producto.id_producto,lastId,prod.cantidad,productoPedidoId]
            );

            await connection.query(
                'UPDATE PRODUCTO SET STOCK = STOCK - ? WHERE ID_PRODUCTO = ?',
                [prod.cantidad,prod.producto.id_producto]
            );
        });
        res.send({status: "ok",data:{ID_PEDIDO:lastId, ID_USUARIO: id_usuario,FECHA_PEDIDO: fecha_pedido, FECHA_ENTREGA: fecha_entrega, ESTADO: "PENDIENTE",PRODUCTOS: incluye}});
    }catch(error){
        console.error('Error durante la generación del pedido: ', error);
        res.send({status: "error", data: "Ocurrió un error"});
    }

};

const getProductosDePedido = async (id) =>{
    const [products] = await connection.query(
        'SELECT p.*,i.CANTIDAD FROM INCLUYE i JOIN PRODUCTO p ON i.ID_PRODUCTO = p.ID_PRODUCTO WHERE i.ID_PEDIDO = ?',
        [id]
    );

    

    return products.map(prod=>({
        ...prod,
        cantidad:prod.CANTIDAD
    }));
}

const getPedidos = async (req,res) =>{
    try{
        const [pedidos] = await connection.query('SELECT * FROM PEDIDO');


        const pedidosConProductos = await Promise.all(
            pedidos.map(async (ped) => {
                const productos = await getProductosDePedido(ped.ID_PEDIDO);
                return {
                    ...ped,
                    productos
                };
            })
        );

        res.json({status:"ok", data: pedidosConProductos});
    }catch (error){
        console.error('Error durante la obtención de productos: ',error);
        res.json({status: "error",data:"Ocurrió un error"});
    }
};

const getPedidoDeUsuario = async (req,res) =>{
    const {id_usuario} = req.params;
    try{
        const [pedidos] = await connection.query(
            "SELECT * FROM PEDIDO WHERE ID_USUARIO = ?",[id_usuario]
        );
        const pedidosConProductos = await Promise.all(
            pedidos.map(async (ped) => {
                const productos = await getProductosDePedido(ped.ID_PEDIDO);
                return {
                    ...ped,
                    productos
                };
            })
        );

        res.json({status:"ok", data: pedidosConProductos});
    }catch (error){
        console.error('Error durante la obtención de productos: ',error);
        res.json({status: "error",data:"Ocurrió un error"});
    }
}

const entregarPedido = async (req,res) =>{
    const {id_pedido} = req.params;

    try{
        await connection.query(
        'UPDATE PEDIDO SET ESTADO = "ENTREGADO" WHERE ID_PEDIDO = ?',
        [id_pedido]
        );
        res.send({status:"ok", data: "El pedido ha sido entregado exitosamente"});
    }catch(error){
        console.error("Error durante la entrega del pedido: ",error);
        res.send({status:"error",data:"Ocurrió un error"});
    }
}

const cancelarPedido = async (req, res) => {
    const { id_pedido } = req.params;

    try {
        // Obtener los productos y cantidades del pedido antes de cancelarlo
        const productos = await getProductosDePedido(id_pedido);

        // Restituir el stock de cada producto
        for (const prod of productos) {
            await connection.query(
                'UPDATE PRODUCTO SET STOCK = STOCK + ? WHERE ID_PRODUCTO = ?',
                [prod.cantidad, prod.ID_PRODUCTO]
            );
        }

        // Actualizar el estado del pedido a "CANCELADO"
        await connection.query(
            'UPDATE PEDIDO SET ESTADO = "CANCELADO" WHERE ID_PEDIDO = ?',
            [id_pedido]
        );

        res.send({ status: "ok", data: "El pedido ha sido cancelado exitosamente y el stock ha sido restituido." });
    } catch (error) {
        console.error("Error durante la cancelación del pedido: ", error);
        res.send({ status: "error", data: "Ocurrió un error" });
    }
};
module.exports= {
    createPedido,
    getPedidos,
    getPedidoDeUsuario,
    entregarPedido,
    cancelarPedido
}