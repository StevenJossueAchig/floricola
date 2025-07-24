import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

import "../../styles/lotes.css";

export default function AdminLotes() {
    const [lotes, setLotes] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [modalAbierto, setModalAbierto] = useState(false);
    const [loteSeleccionado, setLoteSeleccionado] = useState(null);
    const [agregarProductos, setAgregarProductos] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5000/getLotes")
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    const ordenados = data.data.sort((a, b) =>
                        new Date(b.FECHA_INGRESO) - new Date(a.FECHA_INGRESO)
                    );
                    setLotes(ordenados);
                }
            });
    }, []);

    const abrirModal = (lote) => {
        setLoteSeleccionado(lote);
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setLoteSeleccionado(null);
    };

    const lotesFiltrados = lotes.filter((lote) => {
        const fecha = lote.FECHA_INGRESO.split("T")[0];
        return (
            lote.ID_LOTE.toString().includes(busqueda) ||
            fecha.includes(busqueda)
        );
    });
    const [editando, setEditando] = useState(false);
    return (
        <div className="admin-lotes-container">
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                }}
            >
                {/* Botón a la izquierda */}
                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/admin-lotenuevo")}
                >
                    Crear nuevo lote
                </button>

                {/* Título centrado */}
                <div style={{ flex: 1, textAlign: "center", pointerEvents: "none" }}>
                    <h2 style={{ margin: 0 }}>📦 Gestión de Lotes</h2>
                </div>

                {/* Input a la derecha */}
                <input
                    type="text"
                    placeholder="Buscar ID o fecha (aaaa-mm-dd)"
                    className="lote-search-input"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    style={{ width: "250px" }}
                />
            </div>


            <div className="lotes-grid">
                {lotesFiltrados.map((lote) => {

                    console.log("🔍 Lote con productos:", lote);

                    const imagenFondo =
                        lote.productos.length > 0 && lote.productos[0].TOP_PICTURE
                            ? `url(${lote.productos[0].TOP_PICTURE})`
                            : "none";

                    return (
                        <div
                            key={lote.ID_LOTE}
                            className="lote-card"
                            style={{ backgroundImage: imagenFondo }}
                            onClick={() => abrirModal(lote)}
                        >
                            <div className="lote-card-header">Lote N° {lote.ID_LOTE}</div>
                            <div className="lote-card-content">
                                <p>📅 {lote.FECHA_INGRESO.split("T")[0]}</p>
                                <p className="lote-observaciones">
                                    📝 {lote.OBSERVACIONES || "Sin observaciones"}
                                </p>
                                <p>📦 Productos: {lote.productos.length}</p>
                            </div>
                        </div>

                    );
                })}
            </div>


            <Modal isOpen={modalAbierto} onRequestClose={cerrarModal} className="modal-lote" >
                {loteSeleccionado && (
                    <>
                        <div className="modal-header">

                            <span><strong>Lote N° {loteSeleccionado.ID_LOTE}</strong></span>
                            {!editando ? (
                                <button onClick={() => setEditando(true)} className="btn btn-warning btn-sm">✏️ Editar</button>
                            ) : (
                                <button onClick={() => setEditando(false)} className="btn btn-secondary btn-sm">❌ Cancelar</button>
                            )}
                            <span>{loteSeleccionado.FECHA_INGRESO.split("T")[0]}</span>

                        </div>
                        <div style={{ marginTop: 10 }}>
                            <strong>Observaciones:</strong><br />
                            {editando ? (
                                <textarea
                                    value={loteSeleccionado.OBSERVACIONES}
                                    onChange={(e) =>
                                        setLoteSeleccionado({
                                            ...loteSeleccionado,
                                            OBSERVACIONES: e.target.value,
                                        })
                                    }
                                    className="form-control"
                                    style={{ marginTop: 5, marginBottom: 10 }}
                                />
                            ) : (
                                <p class="lote-observaciones">{loteSeleccionado.OBSERVACIONES}</p>
                            )}
                        </div>

                        <hr />
                        <div className="modal-body">
                            <h4>Productos del lote:</h4>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Tipo</th>
                                        <th>Variedad</th>
                                        <th>Color</th>
                                        <th>Cantidad</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {loteSeleccionado.productos.map((prod, idx) => (
                                        <tr key={idx}>
                                            <td>{prod.ID_PRODUCTO}</td>
                                            <td>{prod.TIPO}</td>
                                            <td>{prod.VARIEDAD}</td>
                                            <td>{prod.COLOR}</td>
                                            <td>{prod.CANTIDAD_TOTAL}</td>
                                            <td>{prod.ESTADO}</td>
                                        </tr>

                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div style={{ textAlign: "right", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                            {editando && (
                                <button
                                    className="btn btn-success"
                                    onClick={() => {
                                        fetch(`http://localhost:5000/updateLote/${loteSeleccionado.ID_LOTE}`, {
                                            method: "PUT",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({
                                                fecha_ingreso: loteSeleccionado.FECHA_INGRESO,
                                                observaciones: loteSeleccionado.OBSERVACIONES,
                                                productos: loteSeleccionado.productos.map((p) => ({
                                                    id_producto: p.ID_PRODUCTO,
                                                    cantidad_total: p.CANTIDAD_TOTAL,
                                                    estado: p.ESTADO,
                                                })),
                                            }),
                                        })
                                            .then((res) => res.json())
                                            .then((data) => {
                                                if (data.status === "ok") {
                                                    alert("✅ Lote actualizado");

                                                    // 🔄 Actualiza el lote en el estado global
                                                    setLotes((prevLotes) =>
                                                        prevLotes.map((l) =>
                                                            l.ID_LOTE === loteSeleccionado.ID_LOTE
                                                                ? { ...l, OBSERVACIONES: loteSeleccionado.OBSERVACIONES }
                                                                : l
                                                        )
                                                    );

                                                    setEditando(false);
                                                    cerrarModal();
                                                } else {
                                                    alert("⚠️ Error al actualizar el lote");
                                                }
                                            });
                                    }}
                                >
                                    💾 Guardar
                                </button>
                            )}
                            <button onClick={cerrarModal} className="btn btn-secondary">Cerrar</button>
                        </div>


                    </>
                )}
            </Modal>
        </div>
    );
}
