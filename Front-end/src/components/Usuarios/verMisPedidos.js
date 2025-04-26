import React,{ useEffect, useState } from "react";
import '../../styles/misPedidos.css'

export default function MisPedidos() {
    const [user, setUser] = useState({});
    const [misPedidos, setMisPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch("http://localhost:5000/userData", {
                    method: "POST",
                    crossDomain: true,
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify({
                        token: window.localStorage.getItem("token"),
                    }),
                });

                const data = await res.json();
                console.log("User Data:", data);

                if (data.data === "token expired") {
                    alert("Token expired login again");
                    window.localStorage.clear();
                    window.location.href = "./login";
                    return;
                }

                setUser(data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    });

    useEffect(() => {
        const fetchPedidos = async () => {
            if (user && user.ID_USUARIO) {
                try {
                    const resPedidos = await fetch(`http://localhost:5000/getPedidoDeUsuario/${user.ID_USUARIO}`, {
                        method: "GET",
                        crossDomain: true,
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                            "Access-Control-Allow-Origin": "*",
                        }
                    });

                    const pedidosData = await resPedidos.json();
                    console.log("Pedidos Data:", pedidosData);

                    if (pedidosData && pedidosData.data) {
                        setMisPedidos(pedidosData.data);
                    } else {
                        console.log("No se encontraron pedidos para el usuario.");
                    }
                } catch (error) {
                    console.error("Error fetching pedidos:", error);
                }
            }
        };

        fetchPedidos();
    }, [user]);

    if (loading) {
        return <p>Loading...</p>;
    }


    const cancelar=(id)=>{
        fetch(`http://localhost:5000/cancelarPedido/${id}`,{
            method:"PUT",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            }
        }).then(res=>res.json()).then(res=>{console.log(res);alert("Has cancelado tu pedido (ID: "+id+")")})
        .catch(error=>{
            console.error(error);
            alert("Ocurrió un error al cancelar");
        })
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', options); 
    };
    
    return (
        <div className="cont">
                    {misPedidos.length > 0 ? (
                        misPedidos.map(ped => (     
                            <React.Fragment key={ped.ID_PEDIDO}>
                            <table className="fatherTable">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>FECHA DE PEDIDO</th>
                                        <th>FECHA DE ENTREGA</th>
                                        <th>ESTADO</th>
                                    </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>{ped.ID_PEDIDO}</td>
                                    <td>{formatDate(ped.FECHA_PEDIDO)}</td>
                                    <td>{formatDate(ped.FECHA_ENTREGA)}</td>
                                    <td className={ped.estado ==="CANCELADO" ? "cancelado"
                                    : ped.estado ==="ENTREGADO" ? "entregado" : "pendiente"}>{ped.estado}</td>
                                </tr>
                                <tr>
                                    <td colSpan="4" className="producTit">PRODUCTOS</td>
                                </tr>
                                <tr>
                                    <td colSpan="4">
                                        <table className="childTable">
                                            <thead>
                                                <tr>
                                                    <th className="first">IMAGEN</th>
                                                    <th>ID</th>
                                                    <th>VARIEDAD</th>
                                                    <th>CANTIDAD</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {ped.productos && ped.productos.length > 0 ? (
                                                    ped.productos.map(prod => (
                                                        <tr key={prod.ID_PRODUCTO} className="prodOrdered">
                                                            <td className="first">
                                                                <img src={prod.TOP_PICTURE} alt={prod.VARIEDAD} />
                                                            </td>
                                                            <td>{prod.ID_PRODUCTO}</td>
                                                            <td>{prod.VARIEDAD}</td>
                                                            <td>{prod.cantidad}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4">No hay productos para mostrar.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                {ped.estado==="PENDIENTE" ? <tr colSpan="4" className="forButton cancel">
                                    <button onClick={()=>cancelar(ped.ID_PEDIDO)}>Cancelar pedido</button>
                                </tr>:null}
                                </tbody>
                            </table>
                            </React.Fragment>
                        ))
                    ) : (
                            <p>No hay pedidos para mostrar.</p>
                    )}
        </div>
    );
}
