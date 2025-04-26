import { useEffect, useState } from "react";
import "../../styles/pedido.css";
import { useNavigate } from "react-router-dom";

export default function ElegirProductos() {
    const [productList, setProductList] = useState([]);
    const [searching, setSearching] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/getAllProducts');
                const data = await response.json();
                if (data.status === "ok") {
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
                    setProductList(formattedData);
                } else {
                    console.error("Error al obtener los productos:", data.data);
                }
            } catch (error) {
                console.error("Error en la solicitud al servidor:", error);
            }
        };

        fetchProducts();
    }, []);

    const filteredList = productList.filter(rose =>
        rose.variedad.toLowerCase().includes(searching.toLowerCase())
    );

    const handleProductClick = (productId) => {
      navigate(`/nuevoPedido`); // Redirige a la página /nuevoPedido
  };
  

    return (
        <div>
            <input
                type="text"
                placeholder="Buscar producto..."
                className="searchbar"
                onChange={(e) => setSearching(e.target.value)}
            />
            <div className="listcontainer">
                <ul className="productList">
                    {filteredList.map((rose) => (
                        <li
                            className="flowerop"
                            key={rose.id_producto}
                            onClick={() => handleProductClick(rose.id_producto)}
                        >
                            <div>
                                <img src={rose.top_picture} alt="top_image" />
                            </div>
                            <div className="bottomPart">
                                <h3>{rose.variedad}</h3>
                            </div>
                            <p>{rose.stock} unidades</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
