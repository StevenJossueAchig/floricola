import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Login from "./components/Login/login_component";
import SignUp from "./components/Login/signup_component";
import UserDetails from "./components/Usuarios/userDetails";
import Navbar from "./components/Navbar";
import AdminHome from "./components/Administrador/adminHome";
import AdminUsuarios from "./components/Administrador/admin-usuarios";
import AdminSucursales from "./components/Administrador/admin-sucursales";
import Product from "./components/Usuarios/products";
import About from "./components/about";
import ProtectedRoute from "./components/Rutas/ProtectedRoute";
import Pedido from "./components/Usuarios/pedido";
import MisPedidos from "./components/Usuarios/verMisPedidos";
import AdminPedidos from "./components/Administrador/admin-pedidos";
import AdminProducts from "./components/Administrador/admin-products";

function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn"); // Check if logged in
  const userType = window.localStorage.getItem("userType");
  const [numeroPendientes,setNumeroPendientes] = useState(userType==="Admin" ? 0:null);

  return (
    <Router>
      <div className="App">
        <Navbar isLoggedIn={isLoggedIn} userType={userType} pendientes={numeroPendientes}/>

        <Routes>
          {/* unauthorized route */}
          {!isLoggedIn && (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/" element={<Login />} />
            </>
          )}

          {/* ProtectedRoutes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="/register" element={<Navigate to="/" />} />
            {userType != "Admin" ? (
              <>
                <Route path="/" element={<Navigate to="/userDetails" />} />
                <Route path="/userDetails" element={<UserDetails />} />
                <Route path="/products" element={<Product />} />
                <Route path="/admin-dashboard" element={<Navigate to="/" />}/>
                <Route path="/usuarios" element={<Navigate to="/" />} />
                <Route path="/sucursales" element={<Navigate to="/"  />} />
                <Route path="/nuevoPedido" element={<Pedido />} />
                <Route path="/misPedidos" element={<MisPedidos />}/>
              </>
            ) : (
              <>
                <Route path="/" element={<Navigate to="/admin-dashboard" />} />
                <Route path="/userDetails" element={<Navigate to="/" />} />
                <Route path="/products" element={<Navigate to="/" />} />
                <Route path="/admin-dashboard" element={<AdminHome />} />
                <Route path="/usuarios" element={<AdminUsuarios />} />
                <Route path="/sucursales" element={<AdminSucursales />} />
                <Route path="/pedidos" element={<AdminPedidos setNumeroPendientes={setNumeroPendientes}/>}/>
                <Route path="/admin-products" element={<AdminProducts />} />
              </>
            )}
          </Route>

          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
