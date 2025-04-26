import React, { useEffect, useState } from "react";
import "../../index.css";

export default function SignUp() {
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo_electronico, setCorreo_electronico] = useState("");
  const [rol, setRol] = useState("Usuario");
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [sucursalId, setSucursalId] = useState("");
  const [sucursales, setSucursales] = useState([]);
  const [secretKey, setSecretKey] = useState("");
  const [secretKeyAsign, setSecretKeyAsign] = useState("");

  

  useEffect(() => {
    fetch("/config.json")
      .then((res) => res.json())
      .then((data) => {
        setSecretKeyAsign(data.secretKeyAsign);
      })
      .catch((error) => {
        console.error("Error al obtener la clave secreta desde config.json:", error);
      });

    fetch("http://localhost:5000/getAllSucursales", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setSucursales(data.data);
      })
      .catch((error) => {
        console.error("Error al obtener las sucursales:", error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación de campos
    if (!nombres || !apellidos || !telefono || !correo_electronico || !usuario || !contrasena || !sucursalId) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    if (secretKey !== secretKeyAsign) {
      alert("Código inválido.");
      return;
    }

    // Enviar los datos del formulario
    fetch("http://localhost:5000/register", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        nombres,
        apellidos,
        telefono,
        correo_electronico,
        rol,
        usuario,
        contrasena,
        sucursalId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userRegister");
        if (data.status === "ok") {
          alert("Registro exitoso");
        } else {
          alert(data.error || "Algo salió mal.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Hubo un problema con el registro.");
      });
  };

  return (
    <div className="auth-wrapper-registro">
      <div className="auth-inner-registro">
        <form onSubmit={handleSubmit}>
          <h3>Registro</h3>

          

          
          <div className="mb-3">
                <label>Nombres</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombres"
                  onChange={(e) => setNombres(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label>Apellidos</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Apellidos"
                  onChange={(e) => setApellidos(e.target.value)}
                />
              </div>
              <div className="mb-3">
            <label>Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              placeholder="Correo electrónico"
              onChange={(e) => setCorreo_electronico(e.target.value)}
            />
          </div>
              <div className="row">
            <div className="col-md-6">
            <div className="mb-3">
                <label>Usuario</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Usuario"
                  onChange={(e) => setUsuario(e.target.value)}
                />
              </div>
              
            </div>

            <div className="col-md-6">
              
              <div className="mb-3">
                <label>Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Contraseña"
                  onChange={(e) => setContrasena(e.target.value)}
                />
              </div>
            </div>
          </div>
          

          
          <div className="row">
            <div className="col-md-6">
            <div className="mb-3">
            <label>Teléfono</label>
            <input
              type="text"
              className="form-control"
              placeholder="Teléfono"
              onChange={(e) => setTelefono(e.target.value)}
            />
             </div>
              
            </div>

            <div className="col-md-6">
              
            <div className="mb-3">
            <label>Sucursal</label>
            <select
              className="form-control"
              value={sucursalId}
              onChange={(e) => setSucursalId(e.target.value)}
            >
              <option value="">Selecciona una sucursal</option>
              {sucursales.map((sucursal) => (
                <option key={sucursal.ID_SUCURSAL} value={sucursal.ID_SUCURSAL}>
                  {sucursal.NOMBRE}
                </option>
              ))}
            </select>
          </div>
            </div>
            <div className="mb-3">
            <label>Código</label>
            <input
              type="password"
              className="form-control"
              placeholder="Código"
              onChange={(e) => setSecretKey(e.target.value)}
            />
          </div>
          </div>


          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Registrar
            </button>
          </div>
          <p className="forgot-password text-right">
            ¿Ya te encuentras registrado? <a href="/login">Inicia sesión</a>
          </p>
        </form>
      </div>
    </div>
  );
}