import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../App.css";

function Navbar({ isLoggedIn, userType, pendientes }) {
  const location = useLocation(); // Obtener la ruta actual

  // Logout
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./login";
  };

  return (
    <nav className="navbar">
      <ul className="nav-list">
        {!isLoggedIn && (
          <>
            <li className={`nav-item ${location.pathname === "/login" ? "active" : ""}`}>
              <Link to="/login" className="nav-link">
                Login
              </Link>
            </li>
            <li className={`nav-item ${location.pathname === "/register" ? "active" : ""}`}>
              <Link to="/register" className="nav-link">
                Registrarse
              </Link>
            </li>
          </>
        )}
        {isLoggedIn && userType === "Admin" ? (
          <>
            <li className={`nav-item ${location.pathname === "/admin-dashboard" ? "active" : ""}`}>
              <Link to="/admin-dashboard" className="nav-link">
                Inicio
              </Link>
            </li>
            <li className={`nav-item ${location.pathname === "/usuarios" ? "active" : ""}`}>
              <Link to="/usuarios" className="nav-link">
                Usuarios
              </Link>
            </li>
            <li className={`nav-item ${location.pathname === "/sucursales" ? "active" : ""}`}>
              <Link to="/sucursales" className="nav-link">
                Sucursales
              </Link>
            </li>
          </>
        ) : (
          isLoggedIn && (
            <>
              <li className={`nav-item ${location.pathname === "/userDetails" ? "active" : ""}`}>
                <Link to="/userDetails" className="nav-link">
                  Detalles de usuario
                </Link>
              </li>
              <li className={`nav-item ${location.pathname === "/products" ? "active" : ""}`}>
                <Link to="/products" className="nav-link">
                  Productos
                </Link>
              </li>
            </>
          )
        )}

        <li className={`nav-item ${location.pathname === "/about" ? "active" : ""}`}>
          <Link to="/about" className="nav-link">
            Acerca de
          </Link>
        </li>

        {isLoggedIn && userType !== 'Admin' &&
          <li className={`nav-item ${location.pathname === "/misPedidos" ? "active" : ""}`}>
            <Link to="/misPedidos" className="nav-link">
              Mis pedidos
            </Link>
          </li>
        }

        {isLoggedIn && userType !== 'Admin' &&
          <li className={`nav-item ${location.pathname === "/nuevoPedido" ? "active" : ""}`}>
            <Link to="/nuevoPedido" className="nav-link">
              Realizar pedido
            </Link>
          </li>
        }

        {isLoggedIn && userType === 'Admin' &&
          <li className={`nav-item ${location.pathname === "/pedidos" ? "active" : ""}`}>
            <Link to="/pedidos" className="nav-link">
              Administrar pedidos ({pendientes})
            </Link>
          </li>
        }

        {isLoggedIn && userType === 'Admin' &&
          <li className={`nav-item ${location.pathname === "/admin-products" ? "active" : ""}`}>
            <Link to="/admin-products" className="nav-link">
              Productos
            </Link>
          </li>
        }

        {isLoggedIn && (
          <li className="nav-item nav-item-logout">
            <button
              onClick={logOut}
              className="btn btn-primary"
            >
              Cerrar sesión
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
