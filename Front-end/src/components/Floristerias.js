import React from "react";
import "../styles/floristerias.css";

const floris = [
  {
    nombre: "Fresflor Flores Premium",
    slogan: "Contamos historias con flores",
    plantas: "Flores Premium",
    flores: "Eventos, Bodas, Cumpleaños",
    url: "https://fresflor.com/",
    imagen: "/fresflor.png"
  },
  {
    nombre: "Florería La Orquídea",
    slogan: "Dígalo con flores… todos los días",
    plantas: "Bouquets, Box Flowers",
    flores: "Rosas, Orquídeas, Girasoles",
    url: "https://www.florerialaorquidea.com/",
    imagen: "/orquidea.png"
  },
  {
    nombre: "Floristería Harú",
    slogan: "Donde cada canasta es inspiración",
    plantas: "Arreglos para eventos",
    flores: "Variedad de estacionales",
    url: "https://floresharu.com/",
    imagen: "/haru.png"
  },
  {
    nombre: "Arreglos Florales en Quito",
    slogan: "Flores que hablan por ti",
    plantas: "Arreglos locales en Quito",
    flores: "Personalizados y únicos",
    url: "https://arreglosflorales-enquito.com/",
    imagen: "/quito.png"
  },
  {
    nombre: "MyGlobalFlowers España",
    slogan: "Flores que cruzan fronteras",
    plantas: "Envíos internacionales",
    flores: "Desde €40 opciones",
    url: "https://myglobalflowers.es/",
    imagen: "/myglobalflowers.png"
  },
  {
    nombre: "Florfresa",
    slogan: "Amor y frescura en cada ramo",
    plantas: "Flores locales Ecuador",
    flores: "Cumpleaños, Amor, Eventos",
    url: "https://www.florfresa.ec/",
    imagen: "/florfresa.png"
  },
  {
  nombre: "Florería Escarlata",
  slogan: "Flores que hablan por sí solas",
  plantas: "Arreglos, desayunos, englobados",
  flores: "Rosas, flores achocolatadas",
  url: "https://www.floreriaescarlata.com/",
  imagen: "/escarlata.png"
},
{
  nombre: "Bomflor Floristería Quito",
  slogan: "Servicio inmediato a domicilio",
  plantas: "Arreglos florales y frutales",
  flores: "Orquídeas, globos",
  url: "https://www.bomflor.com/",
  imagen: "/bomflor.png"
},
{
  nombre: "Taty Floristería",
  slogan: "Arte y delicadeza en cada arreglo",
  plantas: "Arreglos florales y frutales",
  flores: "Cumpleaños, amor, eventos",
  url: "https://www.taty-floristeria.com/",
  imagen: "/taty.png"
},
{
  nombre: "Tierra de Flores Quito",
  slogan: "Entrega el mismo día en Quito",
  plantas: "Arreglos frutales y florales",
  flores: "Girasoles, rosas, orquídeas",
  url: "https://www.tierradefloresquito.com/",
  imagen: "/tierradeflores.png"
}

];

export default function Floristerias() {
  return (
    <div
      className="floristerias-container"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/fondologin.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="floristerias-grid">
        {floris.map((f, i) => (
          <a
            key={i}
            href={f.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flor-card"
          >
            <img src={f.imagen} alt={f.nombre} className="flor-img" />
            <h3>{f.nombre}</h3>
            <p className="slogan">{f.slogan}</p>
            <span className="detalle">{f.plantas}</span><br/>
            <span className="detalle">{f.flores}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
