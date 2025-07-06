import React, { useEffect, useState } from "react";
import { faTrash, faSearch, faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../styles/productAdmin.css";
import { Link } from "react-router-dom";

export default function AdminProducts() {
  const [productList, setProductList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    tipo: "",
    variedad: "",
    color: "",
    descripcion: "",
    topPicture: "",
    sidePicture: "",
    longitudDisponibleCm: "",
    tiempoDeVidaDias: "",
    tamanoFlor: "",
    espinas: "",
    petalosPorFlor: "",
    stock: "",
    fechaIngreso: new Date().toISOString(), // ← fecha de hoy en formato YYYY-MM-DD
    precio: ""
  });
  const [editProduct, setEditProduct] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProduct(prev => ({ ...prev, [name]: value }));
  };

  const validarProducto = (producto) => {
    const textoRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/; // solo letras y espacios
    const numeroRegex = /^\d+$/;
    const decimalRegex = /^\d+(\.\d+)?$/;
    const urlRegex = /^(http|https):\/\/[^ "]+$/;

    if (!textoRegex.test(producto.tipo)) {
      alert("El campo 'tipo' solo debe contener letras.");
      return false;
    }

    if (!textoRegex.test(producto.variedad)) {
      alert("El campo 'variedad' solo debe contener letras.");
      return false;
    }

    if (!textoRegex.test(producto.color)) {
      alert("El campo 'color' solo debe contener letras.");
      return false;
    }

    if (!decimalRegex.test(producto.tamanoFlor)) {
      alert("El tamaño de la flor debe ser un número decimal válido.");
      return false;
    }

    if (!numeroRegex.test(producto.espinas)) {
      alert("El campo 'espinas' debe contener solo números.");
      return false;
    }

    if (!numeroRegex.test(producto.petalosPorFlor)) {
      alert("El campo 'pétalos por flor' debe contener solo números.");
      return false;
    }

    if (!numeroRegex.test(producto.stock)) {
      alert("El campo 'stock' debe contener solo números.");
      return false;
    }

    if (!urlRegex.test(producto.topPicture)) {
      alert("La URL de la imagen principal no es válida.");
      return false;
    }

    if (!urlRegex.test(producto.sidePicture)) {
      alert("La URL de la imagen lateral no es válida.");
      return false;
    }

    // Validar campos vacíos restantes
    const camposObligatorios = [
      "descripcion",
      "longitudDisponibleCm",
      "tiempoDeVidaDias"
    ];
    for (const campo of camposObligatorios) {
      if (producto[campo] === "") {
        alert(`El campo '${campo}' no puede estar vacío.`);
        return false;
      }
    }

    return true;
  };


  const createProduct = () => {
    if (Object.values(newProduct).some(val => val === "")) {
      alert("Todos los campos son obligatorios.");
      return;
    }
    if (!validarProducto(newProduct)) return;

    fetch("http://localhost:5000/addProduct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tipo: newProduct.tipo,
        variedad: newProduct.variedad,
        color: newProduct.color,
        descripcion: newProduct.descripcion,
        top_picture: newProduct.topPicture,
        side_picture: newProduct.sidePicture,
        longitud_disponible_cm: newProduct.longitudDisponibleCm,
        tiempo_de_vida_dias: newProduct.tiempoDeVidaDias,
        tamano_flor: newProduct.tamanoFlor,
        espinas: newProduct.espinas,
        petalos_por_flor: newProduct.petalosPorFlor,
        stock: newProduct.stock,
        fecha_ingreso: newProduct.fechaIngreso.split("T")[0], // 👈 solo la fecha
        precio: newProduct.precio
      }),

    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "ok") {
          alert("Producto creado exitosamente.");
          setShowModal(false);
          setNewProduct({
            tipo: "",
            variedad: "",
            color: "",
            descripcion: "",
            longitudDisponibleCm: "",
            tiempoDeVidaDias: "",
            tamanoFlor: "",
            espinas: "",
            petalosPorFlor: "",
            stock: "",
            topPicture: "",
            sidePicture: "",
            fechaIngreso: new Date().toISOString().split("T")[0],
            precio: ""
          });
          fetchProducts(); // Recargar la lista de productos
        } else {
          alert("Error al crear el producto.");
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert("Ocurrió un error durante la operación.");
      });
  };

  const updateProduct = () => {
    if (Object.values(editProduct).some(val => val === "")) {
      alert("Todos los campos son obligatorios.");
      return;
    }
    if (!validarProducto(editProduct)) return;

    fetch(`http://localhost:5000/updateProduct/${editProduct.ID_PRODUCTO}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tipo: editProduct.tipo,
        variedad: editProduct.variedad,
        color: editProduct.color,
        descripcion: editProduct.descripcion,
        longitud_disponible_cm: editProduct.longitudDisponibleCm,
        tiempo_de_vida_dias: editProduct.tiempoDeVidaDias,
        tamano_flor: editProduct.tamanoFlor,
        espinas: editProduct.espinas,
        petalos_por_flor: editProduct.petalosPorFlor,
        stock: editProduct.stock,
        top_picture: editProduct.topPicture,
        side_picture: editProduct.sidePicture,
        fecha_ingreso: editProduct.fechaIngreso,
        precio: editProduct.precio
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "ok") {
          alert("Producto actualizado exitosamente.");
          setShowEditModal(false);
          setEditProduct(null);
          fetchProducts(); // Recargar la lista de productos
        } else {
          alert("Error al actualizar el producto.");
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert("Ocurrió un error durante la operación.");
      });
  };

  const deleteProduct = (productId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      fetch(`http://localhost:5000/deleteProduct/${productId}`, {
        method: "DELETE",
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === "ok") {
            alert("Producto eliminado exitosamente.");
            fetchProducts(); // Recargar la lista de productos
          } else {
            alert("Error al eliminar el producto.");
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert("Ocurrió un error durante la operación.");
        });
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/getAllProducts');
      const data = await response.json();
      if (data.status === "ok") {
        setProductList(data.data);
      } else {
        console.error("Error al obtener los productos:", data.data);
      }
    } catch (error) {
      console.error("Error en la solicitud al servidor:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

const [alertas, setAlertas] = useState([]);

useEffect(() => {
  if (productList.length > 0) {
    const hoy = new Date();
    const nuevasAlertas = [];

    productList.forEach(producto => {
      // Cálculo de caducidad
      const fechaIngreso = new Date(producto.FECHA_INGRESO);
      const vidaUtilDias = parseInt(producto.TIEMPO_DE_VIDA_DIAS_?.split("-")[1] || producto.TIEMPO_DE_VIDA_DIAS_);
      const fechaCaducidad = new Date(fechaIngreso);
      fechaCaducidad.setDate(fechaIngreso.getDate() + vidaUtilDias);

      const diasRestantes = Math.ceil((fechaCaducidad - hoy) / (1000 * 60 * 60 * 24));

      if (diasRestantes <= 3 && diasRestantes > 0) {
        nuevasAlertas.push({
          tipo: "caducar",
          mensaje: `⚠️ Producto "${producto.VARIEDAD}" caduca en ${diasRestantes} día(s).`,
        });
      } else if (diasRestantes <= 0) {
        nuevasAlertas.push({
          tipo: "vencido",
          mensaje: `❌ Producto "${producto.VARIEDAD}" lleva ${Math.abs(diasRestantes)} día(s) caducado.`,
        });
      }

      // Bajo stock
      if (producto.STOCK <= 20) {
        nuevasAlertas.push({
          tipo: "stock_bajo",
          mensaje: `📉 Bajo stock de "${producto.VARIEDAD}" (${producto.STOCK} unidades).`,
        });
      }

      // Riesgo de pérdida por exceso
      if (producto.STOCK >= 400 && diasRestantes <= 5) {
        nuevasAlertas.push({
          tipo: "riesgo",
          mensaje: `⚠️ Riesgo de pérdida por exceso: "${producto.VARIEDAD}" tiene ${producto.STOCK} unidades y caduca en ${diasRestantes} días.`,
        });
      }
    });

    setAlertas(nuevasAlertas);
  }
}, [productList]);


  return (
    <div className="admin-products-container">
      <button
        onClick={() => setShowModal(true)}
        className="btn btn-primary"
        style={{ marginBottom: 20 }}
      >
        Agregar Producto
      </button>

      {showModal && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="popup-inner">
              <h3>Crear Nuevo Producto</h3>
              <input
                type="text"
                name="tipo"
                placeholder="Tipo"
                value={newProduct.tipo}
                onChange={handleInputChange}
                style={{ marginBottom: 10 }}
              />
              <input
                type="text"
                name="variedad"
                placeholder="Variedad"
                value={newProduct.variedad}
                onChange={handleInputChange}
                style={{ marginBottom: 10 }}
              />
              <input
                type="text"
                name="color"
                placeholder="Color"
                value={newProduct.color}
                onChange={handleInputChange}
                style={{ marginBottom: 10 }}
              />
              <input
                type="text"
                name="descripcion"
                placeholder="Descripción"
                value={newProduct.descripcion}
                onChange={handleInputChange}
                style={{ marginBottom: 10 }}
              />
              <input
                type="text"
                name="longitudDisponibleCm"
                placeholder="Longitud Disponible (cm)"
                value={newProduct.longitudDisponibleCm}
                onChange={handleInputChange}
                style={{ marginBottom: 10 }}
              />
              <input
                type="text"
                name="tiempoDeVidaDias"
                placeholder="Tiempo de Vida (días)"
                value={newProduct.tiempoDeVidaDias}
                onChange={handleInputChange}
                style={{ marginBottom: 10 }}
              />
              <input
                type="float"
                name="tamanoFlor"
                placeholder="Tamaño Flor"
                value={newProduct.tamanoFlor}
                onChange={handleInputChange}
                style={{ marginBottom: 10 }}
              />
              <input
                type="int"
                name="espinas"
                placeholder="Espinas"
                value={newProduct.espinas}
                onChange={handleInputChange}
                style={{ marginBottom: 10 }}
              />
              <input
                type="int"
                name="petalosPorFlor"
                placeholder="Pétalos por Flor"
                value={newProduct.petalosPorFlor}
                onChange={handleInputChange}
                style={{ marginBottom: 10 }}
              />
              <input
                type="int"
                name="stock"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={handleInputChange}
                style={{ marginBottom: 10 }}
              />
              <input
                type="text"
                name="topPicture"
                placeholder="Imagen Principal URL"
                value={newProduct.topPicture}
                onChange={handleInputChange}
                style={{ marginBottom: 10 }}
              />
              <input
                type="text"
                name="sidePicture"
                placeholder="Imagen Lateral URL"
                value={newProduct.sidePicture}
                onChange={handleInputChange}
                style={{ marginBottom: 10 }}
              />

              <input
                type="date"
                name="fechaIngreso"
                placeholder="Fecha de Ingreso"
                value={newProduct.fechaIngreso.split("T")[0]}
                onChange={handleInputChange}
                style={{ marginBottom: 10 }}
                disabled
              />
              <input
                type="number"
                name="precio"
                placeholder="Precio"
                step="0.01"
                value={newProduct.precio}
                onChange={handleInputChange}
                style={{ marginBottom: 10 }}
              />


              <button onClick={createProduct} className="btn btn-success">
                Crear Producto
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewProduct({
                    TIPO: "",
                    VARIEDAD: "",
                    COLOR: "",
                    DESCRIPCION: "",
                    LONGITUD_DISPONIBLE_CM_: "",
                    TIEMPO_DE_VIDA_DIAS_: "",
                    TAMANO_FLOR: "",
                    ESPINAS: "",
                    PETALOS_POR_FLOR: "",
                    STOCK: "",
                    TOP_PICTURE: "",
                    SIDE_PICTURE: "",
                    FECHA_INGRESO: new Date().toISOString().split("T")[0],
                    PRECIO: ""
                  });
                }}
                className="btn btn-secondary"
                style={{ marginLeft: 10 }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editProduct && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="popup-inner">
              <h3>Actualizar Producto</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { name: "tipo", label: "Tipo" },
                  { name: "variedad", label: "Variedad" },
                  { name: "color", label: "Color" },
                  { name: "descripcion", label: "Descripción" },
                  { name: "longitudDisponibleCm", label: "Longitud (cm)" },
                  { name: "tiempoDeVidaDias", label: "Vida (días)" },
                  { name: "tamanoFlor", label: "Tamaño Flor", type: "number" },
                  { name: "espinas", label: "Espinas", type: "number" },
                  { name: "petalosPorFlor", label: "Pétalos", type: "number" },
                  { name: "stock", label: "Stock", type: "number" },
                  { name: "fechaIngreso", label: "Fecha Ingreso", type: "date", disabled: true },
                  { name: "precio", label: "Precio", type: "number" },
                  { name: "topPicture", label: "Imagen Principal" },
                  { name: "sidePicture", label: "Imagen Lateral" }
                ].map(({ name, label, type = "text", disabled = false }) => (
                  <div key={name} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <label htmlFor={name} style={{ width: "130px", textAlign: "right" }}>{label}:</label>
                    <input
                      type={type}
                      name={name}
                      value={type === "date" && editProduct[name] ? editProduct[name].split("T")[0] : editProduct[name]}
                      onChange={handleEditChange}
                      style={{ flex: 1 }}
                      disabled={disabled}
                    />
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "20px" }}>
                <button onClick={updateProduct} className="btn btn-success">
                  Actualizar Producto
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditProduct(null);
                  }}
                  className="btn btn-secondary"
                  style={{ marginLeft: 10 }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


<div className="status-legend">
  <div className="status-box"><span className="color" style={{ backgroundColor: "#ffcccc" }}></span>Caducado</div>
  <div className="status-box"><span className="color" style={{ backgroundColor: "#fff3cd" }}></span>Por caducar</div>
  <div className="status-box"><span className="color" style={{ backgroundColor: "#d4edda" }}></span>Bajo stock</div>
</div>



      <table className="product-table">
        <thead>
          <tr>
            <th>ID Producto</th>
            <th>Tipo</th>
            <th>Variedad</th>
            <th>Color</th>
            <th>Descripción</th>
            <th>Longitud Disponible (cm)</th>
            <th>Tiempo de Vida (días)</th>
            <th>Tamaño Flor</th>
            <th>Espinas</th>
            <th>Pétalos por Flor</th>
            <th>Stock</th>
            <th>Fecha Ingreso</th>
            <th>Precio</th>
            <th>Imagen Principal</th>
            <th>Imagen Lateral</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>          
          {productList.map((product) => {
  const fechaIngreso = new Date(product.FECHA_INGRESO);
  const vidaUtil = parseInt(product.TIEMPO_DE_VIDA_DIAS_?.split('-')?.[1] || 0);
  const diasTranscurridos = Math.floor((new Date() - fechaIngreso) / (1000 * 60 * 60 * 24));
  const diasRestantes = vidaUtil - diasTranscurridos;

  let rowClass = "";
  let motivo = "";

  if (diasRestantes <= 0) {
    rowClass = "row-caducado";
    motivo = "Producto caducado";
  } else if (diasRestantes <= 3) {
    rowClass = "row-por-caducar";
    motivo = "Producto por caducar";
  } else if (product.STOCK <= 30) {
    rowClass = "row-bajo-stock";
    motivo = "Stock bajo";
  }
  
  return (
    <tr key={product.ID_PRODUCTO} className={rowClass} title={motivo}>
      <td>{product.ID_PRODUCTO}</td>
      <td>{product.TIPO}</td>
      <td>{product.VARIEDAD}</td>
      <td>{product.COLOR}</td>
      <td>{product.DESCRIPCION}</td>
      <td>{product.LONGITUD_DISPONIBLE_CM_}</td>
      <td>{product.TIEMPO_DE_VIDA_DIAS_}</td>
      <td>{product.TAMANO_FLOR}</td>
      <td>{product.ESPINAS}</td>
      <td>{product.PETALOS_POR_FLOR}</td>
      <td>{product.STOCK}</td>
      <td>{product.FECHA_INGRESO?.split("T")[0]}</td>
      <td>${product.PRECIO}</td>
      <td><img src={product.TOP_PICTURE} alt={product.VARIEDAD} className="product-image" /></td>
      <td><img src={product.SIDE_PICTURE} alt={`Side of ${product.VARIEDAD}`} className="product-image" /></td>
      <td>
        <button onClick={() => {
          setEditProduct({
            tipo: product.TIPO,
            variedad: product.VARIEDAD,
            color: product.COLOR,
            descripcion: product.DESCRIPCION,
            longitudDisponibleCm: product.LONGITUD_DISPONIBLE_CM_,
            tiempoDeVidaDias: product.TIEMPO_DE_VIDA_DIAS_,
            tamanoFlor: product.TAMANO_FLOR,
            espinas: product.ESPINAS,
            petalosPorFlor: product.PETALOS_POR_FLOR,
            stock: product.STOCK,
            topPicture: product.TOP_PICTURE,
            sidePicture: product.SIDE_PICTURE,
            ID_PRODUCTO: product.ID_PRODUCTO,
            fechaIngreso: product.FECHA_INGRESO,
            precio: product.PRECIO
          });

          setShowEditModal(true);
        }} className="btn btn-warning">
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button onClick={() => deleteProduct(product.ID_PRODUCTO)} className="btn btn-danger" style={{ marginLeft: 10 }}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </td>
    </tr>
  );
})}

        </tbody>
      </table>

{alertas.length > 0 && (
  <div className="alertas-container">
    {alertas.map((a, i) => (
      <div key={i} className={`alerta alerta-${a.tipo}`}>
        {a.mensaje}
      </div>
    ))}
  </div>
)}

    </div>
  );
}
