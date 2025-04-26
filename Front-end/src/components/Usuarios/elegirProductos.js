import { useEffect, useState } from "react"
import "../../styles/pedido.css"
import { useNavigate } from "react-router-dom";

export default function ElegirProductos({onContinue}) {
    const [productList, setProductList] = useState([]);
    const [selectedList, setSelectedList] = useState([]);
    const [searching, setSearching] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        // Realizar la solicitud al backend para obtener los productos
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/getAllProducts'); // Ajusta el endpoint según la ruta que tengas
                const data = await response.json();
                if (data.status === "ok") {
                    // Convertir los nombres de las propiedades al formato deseado
                    const formattedData = data.data.map(product => ({
                        id_producto: product.ID_PRODUCTO,
                        tipo: product.TIPO,
                        variedad: product.VARIEDAD,
                        color: product.COLOR,
                        descripcion: product.DESCRIPCION,
                        top_picture: product.TOP_PICTURE,
                        side_picture: product.SIDE_PICTURE,
                        longitud_disponible_cm: product.LONGITUD_DISPONIBLE_CM_,
                        tiempo_de_vida_dias: product.TIEMPO_DE_VIDA_DIAS_,
                        tamano_flor: product.TAMANO_FLOR,
                        espinas: product.ESPINAS,
                        petalos_por_flor: product.PETALOS_POR_FLOR,
                        stock: product.STOCK
                    }));
                    setProductList(formattedData); // Actualizar el estado con los datos formateados
                } else {
                    console.error("Error al obtener los productos:", data.data);
                }
            } catch (error) {
                console.error("Error en la solicitud al servidor:", error);
            }
        };

        fetchProducts();
    }, []);

    const handleSelected = (prod) => {
        setSelectedList((prevProds) => {
            if (prevProds.includes(prevProds.find(ro =>ro.producto===prod))) {
                return prevProds.filter(item => item.producto !== prod);
            } else {
                return [...prevProds,{producto:prod,cantidad:1}];
            }
        })
    }


    const handleQuantity = (prod,quantity)=>{
        setSelectedList((prevProds) => {
            return prevProds.map(item =>{
                if(item.producto === prod){
                    return {producto:item.producto,cantidad:parseInt(quantity,10)};
                }
                return item;
            })
        })
    }

    const filteredList = productList.filter(rose =>
        rose.variedad.toLowerCase().includes(searching.toLowerCase()))

    return (
        <div>
            <div className="buttonHold">
                <button className="back" onClick={()=>navigate(-1)}></button>
            </div>
            <input type="text" placeholder="Buscar producto..." className="searchbar" onChange={(e) => setSearching(e.target.value)} />
            <div className="listcontainer">
                <ul className="productList">
                    {searching === "" ? productList.map((rose) => {
                        return (
                            <li className={`flowerop ${selectedList.includes(selectedList.find(it =>it.producto === rose)) ? "selected" : ""}`}
                                key={rose.id_producto}
                                onClick={() => handleSelected(rose)}
                            >
                                <div>
                                    <img src={rose.top_picture} alt="top_image" />
                                </div>
                                <div className="bottomPart">
                                    <h3>{rose.variedad}</h3>
                                    {selectedList.includes(selectedList.find(it =>it.producto === rose)) ?
                                        <input type="number" min={1} max={rose.stock} defaultValue={1}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) => handleQuantity(rose,e.target.value)}
                                        ></input>
                                        : null}
                                </div>
                                <p>{rose.stock} unidades</p>
                            </li>
                        )
                    })
                        : filteredList.map((rose) => {
                            return (
                                <li className={`flowerop ${selectedList.includes(selectedList.find(it =>it.producto === rose)) ? "selected" : ""}`}
                                    key={rose.id_producto}
                                    onClick={() => handleSelected(rose)}
                                >
                                    <div>
                                        <img src={rose.top_picture} alt="top_image" />
                                    </div>
                                    <div className="bottomPart">
                                        <h3>{rose.variedad}</h3>
                                        {selectedList.includes(selectedList.find(it =>it.producto === rose)) ?
                                            <input type="number" min={1} max={rose.stock} defaultValue={1}
                                                onClick={(e) => e.stopPropagation()}></input>
                                            : null}
                                    </div>
                                </li>
                            )
                        })}
                </ul>
            </div>
            <div className="bottomHold">
                <button className="continue btn btn-primary" onClick={()=>{onContinue(selectedList);}}>Continuar</button>
            </div>
        </div>
    )
}