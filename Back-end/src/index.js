const express = require('express');
const cors = require('cors'); // Importa el módulo cors

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors()); // Usa el middleware cors

// Rutas
app.use(require('./routes/index'));

app.listen(5000, () => {
  console.log('Server on port', 5000);
});
