import { useEffect, useState } from "react"
import "../../styles/pedido.css"
import { useNavigate } from "react-router-dom";

export default function ConfirmarPedido({lista, setContinuar}){

    const navigate = useNavigate();

    const [today,setToday] = useState(new Date());
    const [delivery,setDelivery] = useState(new Date());
    const [userId,setUserId] = useState(0);
    const [userName,setUserName] = useState("");
    const [pedido,setPedido] = useState({});

    useEffect(()=>{
        calcDelivery();

        fetch("http://localhost:5000/userData", {
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
          })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
              setUserId(data.data.ID_USUARIO);
              setUserName(data.data.NOMBRES+" "+data.data.APELLIDOS);
      
              if (data.data === "token expired") {
                alert("Token expired login again");
                window.localStorage.clear();
                window.location.href = "./login";
              }
            });
    },[]);

    useEffect(()=>{
        if(Object.keys(pedido).length > 0 && userId){
            console.log(pedido)
            fetch("http://localhost:5000/createPedido",{
                method:"POST",
                crossDomain: true,
                headers:{
                    "Content-Type": "application/json",
                    Accept:"application/json",
                    "Access-Control-Allow-Origin":"*",
                },
                body: JSON.stringify(pedido)
            }).then((res)=>res.json())
            .then((data)=>{
                if(data.status==="ok") {
                    alert("El pedido se ha registrado y está pendiente.");
                    navigate("/")
                } else{
                    alert(data.error || "Algo salió mal");
                }
            })
            .catch((error)=>{
                console.error("Error: ",error);
                alert("Hubo un problema al registrar el pedido.");
            })
        }
    },[pedido])

    const genPedido = () =>{
        setPedido({
            id_usuario:userId,
            fecha_pedido: today,
            fecha_entrega: delivery,
            incluye: lista
        });
    }

    const getToday = () => {
        setToday(new Date());
    }


    const calcDelivery = () =>{
        let dias = 1;
        if(lista.length > 10){
            dias++;
        }
        if(lista.length > 20){
            dias++;
        }
        let flores = 0;
        lista.map(ped =>{
            flores += ped.cantidad;
        })
        if(flores>100){
            dias++;
        }else if(flores>200){
            dias+=2;
        }

        let releaseDate = new Date();
        let aument = 0;
        while(aument < dias){
            releaseDate.setDate(releaseDate.getDate() +1);
            if(releaseDate.getDay() !== 0 && releaseDate.getDay() !== 6){
                aument++;
            }
        }
        setDelivery(releaseDate);
    }

    return(
        <div>
            <div className="buttonHold">
                <button className="back" onClick={()=>setContinuar(false)}></button>
            </div>
            <div className="confirmHolder">
                <ul className="selectedList">
                        {lista.map((rose) => {
                            return (
                                <li className={"flowerop"}
                                    key={rose.producto.id_producto}
                                >
                                    <div>
                                        <img src={rose.producto.top_picture} alt="top_image" />
                                    </div>
                                        <h3>{rose.producto.variedad}</h3>
                                        <p>{rose.cantidad} unidades</p>
                                </li>
                            )
                        })}
                </ul>
                <div className="infoPedido">
                    <div>
                        <h2>Usuario solicitante:</h2>
                        <p>{userName}</p>
                    </div>
                    <div>
                        <h2>ID del usuario:</h2>
                        <p>{userId}</p>
                    </div>
                    <div>
                        <h2>Fecha de pedido:</h2>
                        <p>{today.getDate()+"/"+(today.getMonth()+1)+"/"+today.getFullYear()}</p>
                    </div>
                    <div>
                        <h2>Fecha de entrega:</h2>
                        <p>{delivery.getDate()+"/"+(delivery.getMonth()+1)+"/"+delivery.getFullYear()}</p>
                    </div>
                </div>
            </div>
            <div className="bottomHold">
                <button className="continue btn btn-primary" onClick={()=>{genPedido()}}>Confirmar</button>
            </div>
        </div>
    )
}