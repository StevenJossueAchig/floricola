import { useEffect, useState } from "react";
import "../../styles/elegirProductosAdmin.css";
import { useNavigate } from "react-router-dom";

export default function AdminLoteNuevo() {
    const [productos, setProductos] = useState([]);
    const [seleccionados, setSeleccionados] = useState([]);
    const [searching, setSearching] = useState("");
    const [confirmando, setConfirmando] = useState(false);
    const [observaciones, setObservaciones] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5000/getAllProducts")
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    setProductos(data.data);
                }
            });
    }, []);

    const toggleProducto = (producto) => {
        const yaEsta = seleccionados.find((p) => p.ID_PRODUCTO === producto.ID_PRODUCTO);
        if (yaEsta) {
            setSeleccionados((prev) => prev.filter((p) => p.ID_PRODUCTO !== producto.ID_PRODUCTO));
        } else {
            setSeleccionados((prev) => [
                ...prev,
                {
                    ...producto,
                    cantidad: 1,
                    estado: "DISPONIBLE",
                },
            ]);
        }
    };

    const handleCantidad = (id, value) => {
        setSeleccionados((prev) =>
            prev.map((p) => (p.ID_PRODUCTO === id ? { ...p, cantidad: parseInt(value, 10) } : p))
        );
    };

    const handleEstado = (id, value) => {
        setSeleccionados((prev) =>
            prev.map((p) => (p.ID_PRODUCTO === id ? { ...p, estado: value } : p))
        );
    };

    const eliminarProducto = (id) => {
        setSeleccionados((prev) => prev.filter((p) => p.ID_PRODUCTO !== id));
    };

    const crearLote = async () => {
        if (seleccionados.length === 0) {
            alert("Debes seleccionar al menos un producto");
            return;
        }

        const payload = {
            observaciones: observaciones.trim() || "TODO NUEVO",
            productos: seleccionados.map((p) => ({
                id_producto: p.ID_PRODUCTO,
                cantidad_total: p.cantidad,
                estado: p.estado,
            })),
        };

        const response = await fetch("http://localhost:5000/createLote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (result.status === "ok") {
            alert("✅ Lote creado correctamente");
            navigate("/admin-lotes");
        } else {
            alert("❌ Error al crear el lote");
        }
    };


    const filteredList = productos.filter((p) =>
        p.VARIEDAD.toLowerCase().includes(searching.toLowerCase())
    );

    return (
        <div className="elegir-container">
            <div className="top-bar">


                {!confirmando && (
                    <>
                        <div className="left">
                            <h2>Crear nuevo lote</h2>
                        </div>
                        <div className="center">
                            <input
                                type="text"
                                placeholder="Buscar producto por variedad..."
                                className="searchbar"
                                value={searching}
                                onChange={(e) => setSearching(e.target.value)}
                            />
                        </div>

                        <div className="right">
                            {seleccionados.length > 0 && (
                                <button className="btn-continuar" onClick={() => setConfirmando(true)}>
                                    Continuar
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>


            {!confirmando ? (
                <>
                    <div className="listcontainer">
                        <ul className="productList">
                            {(searching === "" ? productos : filteredList).map((prod) => {
                                const seleccionado = seleccionados.find((p) => p.ID_PRODUCTO === prod.ID_PRODUCTO);
                                return (
                                    <li
                                        key={prod.ID_PRODUCTO}
                                        className={`flowerop ${seleccionado ? "selected" : ""}`}
                                        onClick={() => toggleProducto(prod)}
                                    >
                                        <div>
                                            <img src={prod.TOP_PICTURE} alt="producto" />
                                        </div>
                                        <div className="bottomPart">
                                            <h3>{prod.VARIEDAD}</h3>
                                        </div>
                                        <p>{prod.STOCK} unidades</p>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </>
            ) : (
                <>
                    <h4>📝 Confirmar productos del lote</h4>
                    <div className="confirm-observaciones">
                        <label>Observaciones (opcional):</label>
                        <textarea
                            className="form-control"
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                        />
                    </div>
                    <div className="confirm-grid">
                        {seleccionados.map((prod) => (
                            <div key={prod.ID_PRODUCTO} className="confirm-card">
                                <div className="card-header">
                                    <div className="nombre-flor">
  <strong>{prod.VARIEDAD}</strong>
  <div className="color-flor">({prod.COLOR})</div>
</div>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => eliminarProducto(prod.ID_PRODUCTO)}
                                    >
                                        ❌
                                    </button>
                                </div>
                                <div className="info-row">
                                    <div>
                                        <label>Cantidad:</label>
                                        <input
                                            type="number"
                                            min={1}
                                            max={prod.STOCK}
                                            value={prod.cantidad}
                                            onChange={(e) => handleCantidad(prod.ID_PRODUCTO, e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label>Estado:</label>
                                        <select
                                            value={prod.estado}
                                            onChange={(e) => handleEstado(prod.ID_PRODUCTO, e.target.value)}
                                        >
                                            <option value="DISPONIBLE">Disponible</option>
                                            <option value="VENDIDO">Vendido</option>
                                            <option value="CADUCADO">Caducado</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bottomHold d-flex gap-2 justify-content-center">
                        <button
                            className="btn btn-secondary"
                            onClick={() => setConfirmando(false)}
                        >
                            ← Volver
                        </button>
                        <button className="btn btn-success" onClick={crearLote}>
                            📦 Crear lote
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
