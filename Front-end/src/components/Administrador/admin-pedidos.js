import React,{ useEffect, useState } from "react";
import '../../styles/misPedidos.css'

export default function AdminPedidos({setNumeroPendientes}) {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    const [solicitantes,setSolicitantes] = useState([])

    useEffect(() => {
        const fetchPedidos = async () => {
                try {
                    const resPedidos = await fetch(`http://localhost:5000/getPedidos`, {
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
                        setPedidos(pedidosData.data);
                    } else {
                        console.log("No hay pedidos registrados.");
                    }
                    let pen = 0;
                    for(const ped of pedidos){
                        if(ped.estado === 'PENDIENTE'){
                            pen++;
                        }
                    }
                    setNumeroPendientes(pen);

                } catch (error) {
                    console.error("Error fetching pedidos:", error);
                }finally{
                    setLoading(false)
                }
            };

        fetchPedidos();
    });

    if (loading) {
        return <p>Loading...</p>;
    }


    const entregar=(id)=>{
        fetch(`http://localhost:5000/entregarPedido/${id}`,{
            method:"PUT",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            }
        }).then(res=>res.json()).then(res=>{console.log(res);alert("El pedido ha sido entregado (ID: "+id+")")})
        .catch(error=>{
            console.error(error);
            alert("Ocurrió un error al entregar");
        })
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', options); 
    };
    
    return (
        <div className="cont">
                    {pedidos.length > 0 ? (
                        pedidos.map(ped => (     
                            <React.Fragment key={ped.ID_PEDIDO}>
                            <table className="fatherTable">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>ID DE USUARIO</th>
                                        <th>FECHA DE PEDIDO</th>
                                        <th>FECHA DE ENTREGA</th>
                                        <th>ESTADO</th>
                                    </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>{ped.ID_PEDIDO}</td>
                                    <td>{ped.ID_USUARIO}</td>
                                    <td>{formatDate(ped.FECHA_PEDIDO)}</td>
                                    <td>{formatDate(ped.FECHA_ENTREGA)}</td>
                                    <td className={ped.estado ==="CANCELADO" ? "cancelado"
                                    : ped.estado ==="ENTREGADO" ? "entregado" : "pendiente"}>{ped.estado}</td>
                                </tr>
                                <tr>
                                    <td colSpan="5" className="producTit">PRODUCTOS</td>
                                </tr>
                                <tr>
                                    <td colSpan="5">
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
                                                        <td colSpan="5">No hay productos para mostrar.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                {ped.estado==="PENDIENTE" ? <tr colSpan="5" className="forButton deliver">
                                    <button onClick={()=>entregar(ped.ID_PEDIDO)}>Entregar pedido</button>
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
