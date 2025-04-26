import { useState } from "react"
import "../../styles/pedido.css"
import ElegirProductos from "./elegirProductos";
import ConfirmarPedido from "./confirmarPedido";

export default function Pedido() {

    const [continuar, setContinuar] = useState(false);
    const [list, setList] = useState([]);

    const onContinue = (lista) => {
        setList(lista);
        if (lista.length <= 0) {
            alert("ERROR. Escoja por lo menos un producto.");
        } else {
            let hasError = false;
            for (let i = 0; i < lista.length; i++) {
                const l = lista[i];
                if (l.cantidad > l.producto.stock) {
                    alert("ERROR. La cantidad pedida no puede superar el stock.");
                    hasError = true;
                    break;
                } else if (l.cantidad < 1) {
                    alert("ERROR. Elija al menos una unidad de cada producto.");
                    hasError = true;
                    break;
                }
            }
            if (!hasError) {
                setContinuar(true);
            }
        }
    }

    return (
        <div>
            {!continuar ?
                <ElegirProductos onContinue={onContinue} />
                : <ConfirmarPedido lista={list} setContinuar={setContinuar} />}
        </div>
    )
}
