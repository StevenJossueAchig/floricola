const { Router } = require('express');
const router = Router();

const { 
    registerUser,loginUser,getUserData,deleteUser,getAllUsers
} = require('../controllers/usuarios.controller');

const { 
    createSucursal,
    getSucursalById,
    getAllSucursales,
    updateSucursal,
    deleteSucursal,
} = require('../controllers/sucursales.controller');

const {
    createPedido,
    getPedidos,
    getPedidoDeUsuario,
    entregarPedido,
    cancelarPedido
} = require('../controllers/pedidos.controller');

const {
    addProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/productos.controller');

// RUTAS PRODUCTOS
router.post('/addProduct', addProduct);
router.get('/getAllProducts', getAllProducts);
router.get('/getProduct/:id', getProductById);
router.post('/updateProduct/:id', updateProduct);
router.delete('/deleteProduct/:id', deleteProduct);

// USUARIOS
router.post('/register', registerUser);
router.post('/login-user', loginUser);
router.post('/userData', getUserData);
router.post('/deleteUser', deleteUser);
router.get('/getAllUser', getAllUsers);

// Rutas para SUCURSAL
router.post('/createSucursal', createSucursal);
router.get('/getSucursal/:id', getSucursalById);
router.get('/getAllSucursales', getAllSucursales);
router.post('/updateSucursal/:id', updateSucursal);
router.post('/deleteSucursal/:id', deleteSucursal);
// Rutas para PEDIDOS
router.post('/createPedido',createPedido);
router.get('/getPedidos',getPedidos);
router.get('/getPedidoDeUsuario/:id_usuario',getPedidoDeUsuario);
router.put('/entregarPedido/:id_pedido',entregarPedido);
router.put('/cancelarPedido/:id_pedido',cancelarPedido);

module.exports = router;
