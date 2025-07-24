import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../styles/productAdmin.css";

export default function AdminProducts() {
  const [estadoFiltro, setEstadoFiltro] = useState("TODOS"); // 'VISIBLE', 'OCULTO', 'TODOS'
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
    estado: "VISIBLE",
    //stock: "",
    //fechaIngreso: new Date().toISOString(), ← fecha de hoy en formato YYYY-MM-DD
    precio_unitario: ""
  });
  const [editProduct, setEditProduct] = useState(null);

  const navigate = useNavigate();

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

    /*if (!numeroRegex.test(producto.stock)) {
      alert("El campo 'stock' debe contener solo números.");
      return false;
    }*/

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
        estado: newProduct.estado,
        //stock: newProduct.stock,
        //fecha_ingreso: newProduct.fechaIngreso.split("T")[0],  solo la fecha
        precio_unitario: newProduct.precio_unitario
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
            //stock: "",
            topPicture: "",
            sidePicture: "",
            estado: "",
            //fechaIngreso: new Date().toISOString().split("T")[0],
            precio_unitario: ""
          });
          fetchProducts(); // Recargar la lista de productos
        } else if (data.data === "Ya existe un producto con esos mismos atributos.") {
          alert("Producto ya existe con esos mismos atributos.");
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
        //stock: editProduct.stock,
        top_picture: editProduct.topPicture,
        side_picture: editProduct.sidePicture,
        estado: editProduct.estado,
        //fecha_ingreso: editProduct.fechaIngreso,
        precio_unitario: editProduct.precio_unitario
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
        console.log("Productos recibidos:", data.data); // Aquí ves si llega STOCK
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
      const nuevasAlertas = [];

      productList.forEach(producto => {
        if (producto.STOCK <= 100) {
          nuevasAlertas.push({
            tipo: "stock_bajo",
            mensaje: `📉 Bajo stock de "${producto.VARIEDAD}" (${producto.STOCK} unidades).`,
          });
        }
      });

      setAlertas(nuevasAlertas);
    }
  }, [productList]);



  return (

    <div className="admin-products-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="filtroEstado"
              value="VISIBLE"
              checked={estadoFiltro === "VISIBLE"}
              onChange={() => setEstadoFiltro("VISIBLE")}
            />
            Visibles
          </label>
          <label>
            <input
              type="radio"
              name="filtroEstado"
              value="OCULTO"
              checked={estadoFiltro === "OCULTO"}
              onChange={() => setEstadoFiltro("OCULTO")}
            />
            Ocultos
          </label>
          <label>
            <input
              type="radio"
              name="filtroEstado"
              value="TODOS"
              checked={estadoFiltro === "TODOS"}
              onChange={() => setEstadoFiltro("TODOS")}
            />
            Todos
          </label>
        </div>


        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => navigate("/admin-lotes")} // después lo cambias por navegación
            className="btn btn-lotes"
            style={{ marginBottom: 20 }}
          >
            Lotes
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
            style={{ marginBottom: 20 }}
          >
            Agregar Producto
          </button>
        </div>
      </div>

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
                type="number"
                name="precio_unitario"
                placeholder="Precio_unitario"
                step="0.01"
                value={newProduct.precio_unitario}
                onChange={handleInputChange}
                style={{ marginBottom: 10 }}
              />
              <div style={{ marginBottom: 10 }}>
                <select
                  name="estado"
                  value={newProduct.estado}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                  }}
                >
                  <option value="VISIBLE">Visible</option>
                  <option value="OCULTO">Oculto</option>
                </select>
              </div>

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
                    //STOCK: "",
                    TOP_PICTURE: "",
                    SIDE_PICTURE: "",
                    //FECHA_INGRESO: new Date().toISOString().split("T")[0],
                    PRECIO_UNITARIO: ""
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
                  //{ name: "stock", label: "Stock", type: "number" },
                  //{ name: "fechaIngreso", label: "Fecha Ingreso", type: "date", disabled: true },
                  { name: "precio_unitario", label: "Precio", type: "number" },
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
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <label htmlFor="estado" style={{ width: "130px", textAlign: "right" }}>Estado:</label>
                  <select
                    name="estado"
                    value={editProduct.estado}
                    onChange={handleEditChange}
                    style={{ flex: 1, padding: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
                  >
                    <option value="VISIBLE">Visible</option>
                    <option value="OCULTO">Oculto</option>
                  </select>
                </div>
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
            <th>Precio</th>
            <th>Imagen Principal</th>
            <th>Imagen Lateral</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {
            (() => {
              const productosFiltrados = productList.filter(product => {
                if (estadoFiltro === "TODOS") return true;
                return product.ESTADO === estadoFiltro;
              });

              if (productosFiltrados.length === 0) {
                return (
                  <tr>
                    <td colSpan="15" style={{ textAlign: "center", padding: "20px", fontWeight: "bold", color: "#555" }}>
                      {estadoFiltro === "VISIBLE" && "No existen productos visibles."}
                      {estadoFiltro === "OCULTO" && "No existen productos ocultos."}
                      {estadoFiltro === "TODOS" && "No hay productos registrados."}
                    </td>
                  </tr>
                );
              }

              return productosFiltrados.map((product) => {
                let rowClass = "";
                let motivo = "";

                if (product.STOCK <= 100) {
                  rowClass = "row-bajo-stock";
                  motivo = `📉 Bajo stock: quedan ${product.STOCK} unidades`;
                }

                return (
                  <tr
                    key={product.ID_PRODUCTO}
                    className={`${rowClass} ${product.ESTADO === "OCULTO" ? "row-oculto" : ""}`}
                    title={motivo || (product.ESTADO === "OCULTO" ? "Producto oculto" : "")}
                  >
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
                    <td>${product.PRECIO_UNITARIO}</td>
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
                          topPicture: product.TOP_PICTURE,
                          sidePicture: product.SIDE_PICTURE,
                          ID_PRODUCTO: product.ID_PRODUCTO,
                          estado: product.ESTADO,
                          precio_unitario: product.PRECIO_UNITARIO
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
              });
            })()
          }
        </tbody>

      </table>

    </div>
  );
}
