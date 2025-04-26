import React, { useEffect, useState } from "react";
import { faTrash, faSearch, faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../App.css";

export default function SucursalHome() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [newSucursal, setNewSucursal] = useState({
    nombre: "",
    direccion: "",
  });
  const [editing, setEditing] = useState(false);
  const [editSucursalId, setEditSucursalId] = useState(null);

  useEffect(() => {
    getAllSucursal();
  }, [searchQuery]);

  const getAllSucursal = () => {
    fetch(`http://localhost:5000/getAllSucursales?search=${searchQuery}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "sucursalData");
        setData(data.data);
      });
  };

  const deleteSucursal = (id, nombre) => {
    if (window.confirm(`¿Estás seguro que deseas eliminar la sucursal ${nombre}?`)) {
      fetch(`http://localhost:5000/deleteSucursal/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          alert("Sucursal eliminada exitosamente.");
          getAllSucursal();
        });
    }
  };

  const createOrUpdateSucursal = () => {
    if (!newSucursal.nombre || !newSucursal.direccion) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    const url = editing 
      ? `http://localhost:5000/updateSucursal/${editSucursalId}`
      : "http://localhost:5000/createSucursal";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSucursal),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          alert("Operación exitosa.");
          setShowPopup(false);
          setEditing(false);
          setNewSucursal({ nombre: "", direccion: "" });
          getAllSucursal();
        } else {
          alert(data.data); // Mostrar el mensaje de error específico del servidor
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert("Ocurrió un error durante la operación.");
      });
};


  const handleEditSucursal = (sucursal) => {
    setEditing(true);
    setEditSucursalId(sucursal.ID_SUCURSAL);
    setNewSucursal({
      nombre: sucursal.NOMBRE,
      direccion: sucursal.DIRECCION,
    });
    setShowPopup(true);
  };

  function handleSearch(e) {
    setSearchQuery(e.target.value);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setNewSucursal((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="auth-wrapper-sucursales">
      <div className="auth-inner-sucursales">
        <h3>SUCURSALES</h3>
        <div style={{ position: "relative", marginBottom: 10 }}>
          <FontAwesomeIcon
            icon={faSearch}
            style={{ position: "absolute", left: 10, top: 13, color: "black" }}
          />
          <input
            type="text"
            placeholder="Search..."
            onChange={handleSearch}
            style={{
              padding: "8px 32px 8px 32px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
          <span
            style={{ position: "absolute", right: 10, top: 8, color: "#aaa" }}
          >
            {searchQuery.length > 0
              ? `Sucursales encontradas ${data.length}`
              : `Total sucursales ${data.length}`}
          </span>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Editar</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {data.map((sucursal) => {
                return (
                  <tr key={sucursal.ID_SUCURSAL}>
                    <td>{sucursal.NOMBRE}</td>
                    <td>{sucursal.DIRECCION}</td>
                    <td>
                      <FontAwesomeIcon
                        icon={faEdit}
                        onClick={() => handleEditSucursal(sucursal)}
                      />
                    </td>
                    <td>
                      <FontAwesomeIcon
                        icon={faTrash}
                        onClick={() =>
                          deleteSucursal(sucursal.ID_SUCURSAL, sucursal.NOMBRE)
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <button
          onClick={() => {
            setShowPopup(true);
            setEditing(false);
            setNewSucursal({ nombre: "", direccion: "" });
          }}
          className="btn btn-primary"
          style={{ marginTop: 10 }}
        >
          <FontAwesomeIcon icon={faPlus} /> Crear Sucursal
        </button>

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <div className="popup-inner">
                <h3>{editing ? "Editar Sucursal" : "Crear Nueva Sucursal"}</h3>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre de la sucursal"
                  value={newSucursal.nombre}
                  onChange={handleInputChange}
                  style={{
                    marginBottom: 10,
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                />
                <input
                  type="text"
                  name="direccion"
                  placeholder="Dirección de la sucursal"
                  value={newSucursal.direccion}
                  onChange={handleInputChange}
                  style={{
                    marginBottom: 10,
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                />
                <button onClick={createOrUpdateSucursal} className="btn btn-success">
                  {editing ? "Guardar Cambios" : "Crear"}
                </button>
                <button
                  onClick={() => {
                    setShowPopup(false);
                    setEditing(false);
                    setNewSucursal({ nombre: "", direccion: "" });
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
      </div>
    </div>
  );
}
