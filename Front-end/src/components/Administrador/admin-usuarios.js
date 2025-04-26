import React, { useEffect, useState } from "react";
import { faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../App.css";

export default function AdminHome() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getAllUser();
  }, [searchQuery]);

  const getAllUser = () => {
    fetch(`http://localhost:5000/getAllUser?search=${searchQuery}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        setData(data.data);
      });
  };

  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./login";
  };

  const deleteUser = (id, name) => {
    if (window.confirm(`¿Estás seguro que deseas eliminar a ${name} ?`)) {
      fetch("http://localhost:5000/deleteUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.data);
          getAllUser();
        });
    }
  };

  function handleSearch(e) {
    setSearchQuery(e.target.value);
  }

  return (
    <div className="auth-wrapper-usuarios">
      <div className="auth-inner-usuarios">
        <h3>USUARIOS</h3>
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
           {searchQuery.length > 0 ? `Usuarios encontrados ${data.length}` : `Total usuarios ${data.length}`}
          </span>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Correo electrónico</th>
                <th>Teléfono</th>
                <th>Sucursal</th>
                <th>Rol</th>
                <th>Usuario</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {data.map((i) => {
                return (
                  <tr key={i.ID_USUARIO}>
                    <td>{i.NOMBRES}</td>
                    <td>{i.APELLIDOS}</td>
                    <td>{i.CORREO_ELECTRONICO}</td>
                    <td>{i.TELEFONO}</td>
                    <td>{i.CORREO_ELECTRONICO}</td>
                    <td>{i.ROL}</td>
                    <td>{i.USUARIO}</td>
                    <td>
                      <FontAwesomeIcon
                        icon={faTrash}
                        onClick={() => deleteUser(i.ID_USUARIO, i.NOMBRES)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <button
          onClick={logOut}
          className="btn btn-primary"
          style={{ marginTop: 10 }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
