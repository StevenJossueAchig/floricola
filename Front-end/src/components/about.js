import React, { useEffect, useState } from "react";
import "../styles/dashboardVentas.css";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";

const COLORS = ["#00C49F", "#FF8042"];

export default function DashboardVentas() {
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);
  const [productoMayorStock, setProductoMayorStock] = useState(null);
  const [productoMenorStock, setProductoMenorStock] = useState(null);
  const [imagenPorVariedad, setImagenPorVariedad] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pedidosRes = await fetch("http://localhost:5000/getPedidos");
        const pedidosData = await pedidosRes.json();
        const productosRes = await fetch("http://localhost:5000/getAllProducts");
        const productosData = await productosRes.json();

        const pedidos = pedidosData.status === "ok" ? pedidosData.data : [];
        const productos = productosData.status === "ok" ? productosData.data : [];

        if (productos.length > 0) {
          const ordenados = [...productos].sort((a, b) => a.STOCK - b.STOCK);
          setProductoMenorStock(ordenados[0]);
          setProductoMayorStock(ordenados[ordenados.length - 1]);
        }

        const nombrePorId = {};
        const imagenes = {};

        productos.forEach(p => {
          nombrePorId[p.ID_PRODUCTO] = p.VARIEDAD;
          if (p.VARIEDAD && p.TOP_PICTURE) {
            imagenes[p.VARIEDAD] = p.TOP_PICTURE;
          }
        });

        setImagenPorVariedad(imagenes);

        const conteo = {};
        pedidos.forEach(pedido => {
          if (pedido.estado === "ENTREGADO" && pedido.productos) {
            pedido.productos.forEach(prod => {
              const nombre = nombrePorId[prod.ID_PRODUCTO] || prod.ID_PRODUCTO;
              conteo[nombre] = (conteo[nombre] || 0) + prod.cantidad;
            });
          }
        });

        const masVendidos = Object.entries(conteo)
          .map(([nombre, cantidad]) => ({ nombre, cantidad }))
          .sort((a, b) => b.cantidad - a.cantidad)
          .slice(0, 5);

        setProductosMasVendidos(masVendidos);
      } catch (error) {
        console.error("Error cargando el dashboard:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Dashboard de Ventas</h1>

      <section className="dashboard-section">
        <h2>Top Productos Más Vendidos</h2>
        {productosMasVendidos.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productosMasVendidos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cantidad" fill="#8884d8" name="Unidades Vendidas" />
            </BarChart>
          </ResponsiveContainer>
        ) : <p>No hay datos suficientes.</p>}
      </section>

      <section className="dashboard-section analysis-section">
        <h2>📊 Análisis de Ventas & Recomendaciones</h2>
        {productosMasVendidos.length > 0 ? (
          <>
            <div className="insight-cards">
              <div className="card top-product">
                <h3>🌟 Flor Más Vendida</h3>
                <img src={imagenPorVariedad[productosMasVendidos[0].nombre] || "https://via.placeholder.com/80"} alt="Top flor" />
                <p><strong>{productosMasVendidos[0].nombre}</strong></p>
                <span>{productosMasVendidos[0].cantidad} unidades vendidas</span>
              </div>

              <div className="card low-product">
                <h3>📉 Flor con Menor Rotación</h3>
                <img src={imagenPorVariedad[productosMasVendidos[productosMasVendidos.length - 1].nombre] || "https://via.placeholder.com/80"} alt="Menor flor" />
                <p><strong>{productosMasVendidos[productosMasVendidos.length - 1].nombre}</strong></p>
                <span>{productosMasVendidos[productosMasVendidos.length - 1].cantidad} unidades vendidas</span>
              </div>

              <div className="card suggestion">
                <h3>💡 Recomendación</h3>
                <p>
                  Considera <strong>aumentar stock</strong> de <em>{productosMasVendidos[0].nombre}</em> y revisar la viabilidad de <em>{productosMasVendidos[productosMasVendidos.length - 1].nombre}</em>.
                </p>
              </div>
            </div>

            <div className="product-gallery">
              {productosMasVendidos.map((prod, i) => (
                <div className="product-card" key={i}>
                  <img
                    src={imagenPorVariedad[prod.nombre] || "https://via.placeholder.com/80?text=Flor"}
                    alt={prod.nombre}
                  />
                  <p>{prod.nombre}</p>
                  <span>{prod.cantidad} vendidos</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>No hay suficientes datos para el análisis.</p>
        )}
      </section>

      <section className="dashboard-section">
        <h2>Comparativa: Mayor vs Menor Stock</h2>
        {(productoMayorStock && productoMenorStock) ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: productoMayorStock.VARIEDAD, value: productoMayorStock.STOCK },
                  { name: productoMenorStock.VARIEDAD, value: productoMenorStock.STOCK }
                ]}
                cx="50%" cy="50%" outerRadius={100}
                label
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p>Cargando datos de stock...</p>
        )}
      </section>
    </div>
  );
}
