CREATE DATABASE bitciencia;
USE bitciencia;

-- Tabla sucursal
CREATE TABLE sucursal (
    ID_SUCURSAL INT PRIMARY KEY,
    NOMBRE VARCHAR(100),
    DIRECCION VARCHAR(255)
);

-- Tabla usuario
CREATE TABLE usuario (
    ID_USUARIO INT PRIMARY KEY,
    ID_SUCURSAL INT,
    USUARIO VARCHAR(50),
    CONTRASENA VARCHAR(100),
    NOMBRES VARCHAR(100),
    APELLIDOS VARCHAR(100),
    TELEFONO VARCHAR(20),
    CORREO_ELECTRONICO VARCHAR(100),
    ROL VARCHAR(50),
    FOREIGN KEY (ID_SUCURSAL) REFERENCES sucursal(ID_SUCURSAL)
);

-- Tabla pedido
CREATE TABLE pedido (
    ID_PEDIDO INT PRIMARY KEY,
    ID_USUARIO INT,
    FECHA_PEDIDO DATE,
    FECHA_ENTREGA DATE,
    estado VARCHAR(50),
    FOREIGN KEY (ID_USUARIO) REFERENCES usuario(ID_USUARIO)
);

-- Tabla producto
CREATE TABLE PRODUCTO (
  ID_PRODUCTO INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  TIPO VARCHAR(100) NOT NULL,
  VARIEDAD VARCHAR(100) NOT NULL,
  COLOR VARCHAR(50) NOT NULL,
  DESCRIPCION TEXT,
  TOP_PICTURE VARCHAR(255),
  SIDE_PICTURE VARCHAR(255),
  LONGITUD_DISPONIBLE_CM_ VARCHAR(50),
  TIEMPO_DE_VIDA_DIAS_ VARCHAR(50),
  TAMANO_FLOR DECIMAL(5,2),
  ESPINAS INT,
  PETALOS_POR_FLOR INT,
  STOCK INT,
  FECHA_INGRESO DATE,
  PRECIO DECIMAL(10,2)
);

-- Tabla incluye
CREATE TABLE incluye (
    ID_PRODUCTO_PEDIDO INT PRIMARY KEY,
    ID_PRODUCTO INT,
    ID_PEDIDO INT,
    CANTIDAD INT,
    FOREIGN KEY (ID_PRODUCTO) REFERENCES producto(ID_PRODUCTO),
    FOREIGN KEY (ID_PEDIDO) REFERENCES pedido(ID_PEDIDO)
);


INSERT INTO sucursal (ID_SUCURSAL, NOMBRE, DIRECCION) VALUES
(1, 'Sucursal 1', 'Dirección prueba, Calee Prueba OE-799 y Avenida prueba'),
(2, 'Sucursal 3', 'Colon y 6 de Diciembre'),
(3, 'Sucursal 2', 'Mariscal Sucre'),
(4, 'Sucursal 4', 'Sangolqui'),
(5, 'Sucursal 5', 'El Quinche');

INSERT INTO usuario (ID_USUARIO, ID_SUCURSAL, USUARIO, CONTRASENA, NOMBRES, APELLIDOS, TELEFONO, CORREO_ELECTRONICO, ROL) VALUES
(2, NULL, 'admin', '$2a$10$NCkZvAwSeySEslNkRlryluWhzolE3ElDwqKYYl1Ch2k0znQ6ruo9y', 'admin', 'admin', '0996388431', 'admin@gmail.com', 'Admin'),
(6, 2, 'David', '$2a$10$F31NlXMgLNRiKC5XOfTZJOCoYTQPTd5C8vFM5ZPIkO9sVauweCCXK', 'David', 'Leal', '0123456789', 'correo@falso.com', 'Usuario'),
(7, 1, 'steven', '$2a$10$Zhp/vqrFyQEk6N7wI9qhxO..G0wNWt9NWd970Rkn5NYerXkX9xwlC', 'Steven', 'Achig', '0998476747', 'stevenjossue5@gmail.com', 'Admin'),
(8, 4, 'gensis', '$2a$10$UMtvdrO3dQg8whkHUomUIuAeO5uk5bwp4RxEv6S88falW89nmFOUe', 'Genesis', 'Ruales', '8408949', 'Genesis@gmail.com', 'Usuario'),
(9, 2, 'kevinandrade', '$2a$10$SSwrxCg0AGdnIY9aFOdnROGW9ZeaVSstTVqMlRGeqTq76rhlPhkfG', 'Kevin', 'Andrade', '0998647585', 'kevinandrade@gmail.com', 'Usuario'),
(10, 3, 'Lola', '$2a$10$FT/3t0CdPRTlLH9xE76.G.C3QxHWPk8YPcFS8DLa9Nv0a7LByXCRa', 'Lola', 'Lolita', '1234567890', 'Lola@amor.com', 'Usuario');

INSERT INTO producto (ID_PRODUCTO, TIPO, VARIEDAD, COLOR, DESCRIPCION, TOP_PICTURE, SIDE_PICTURE, LONGITUD_DISPONIBLE_CM_, TIEMPO_DE_VIDA_DIAS_, TAMANO_FLOR, ESPINAS, PETALOS_POR_FLOR, STOCK, FECHA_INGRESO, PRECIO) VALUES
(1, 'Rose', 'Alba', 'White', 'White', 'https://fincasderosas.com/wp-content/uploads/2020/12/rosa-alba1.jpg', 'https://floramarket.es/wp-content/uploads/2022/03/rosa-alba-1.png', '50 to 90', '14-18', 6.5, 1, 47, 140, '2025-01-15', 1.20),
(2, 'Rose', 'Altamira', 'Novelty', 'Cherry/Red', 'https://www.staroses.com/wp-content/uploads/2020/02/altamira2-1.jpg', 'https://www.staroses.com/wp-content/uploads/2020/02/altamira2-1.jpg', '40 to 70', '16-20', 5.4, 1, 56, 497, '2025-01-16', 1.40),
(3, 'Roses', 'Amorosas', 'Pink', 'Medium Pink', 'https://297820.selcdn.ru/crm1/images/species/4144.jpg?=2023-12-01+06%3A28%3A39', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf9akiiFj_LJvhjSodQjLh6eTd37YmykH6xnm-M6eDaeohen-7RuR4pHXHW19Y4514q4o&usqp=CAU', '60 to 90', '15-25', 6.0, 1, 25, 42, '2025-01-17', 1.10),
(4, 'Rose', 'Gerbera', 'Fucsia', 'Pink Petales', 'https://cdn.pixabay.com/photo/2016/04/20/21/17/png-1342113_1280.png', 'https://www.thecolvinco.com/es/c/wp-content/uploads/2020/06/gerbera_red-1024x1024.jpg', '60 to 80', '15-35', 5.5, 0, 35, 60, '2025-01-18', 1.30);

INSERT INTO pedido (ID_PEDIDO, ID_USUARIO, FECHA_PEDIDO, FECHA_ENTREGA, estado) VALUES
(13, 8, '2024-08-19', '2024-08-20', 'ENTREGADO'),
(14, 8, '2024-08-20', '2024-08-21', 'CANCELADO'),
(15, 8, '2024-08-20', '2024-08-21', 'ENTREGADO'),
(16, 8, '2024-08-20', '2024-08-21', 'ENTREGADO'),
(17, 8, '2024-08-20', '2024-08-21', 'ENTREGADO'),
(18, 8, '2024-09-17', '2024-09-18', 'ENTREGADO'),
(19, 8, '2025-05-20', '2025-05-21', 'ENTREGADO'),
(20, 10, '2025-05-27', '2025-05-28', 'ENTREGADO'),
(21, 10, '2025-05-27', '2025-05-28', 'PENDIENTE');

INSERT INTO incluye (ID_PRODUCTO, ID_PEDIDO, CANTIDAD, ID_PRODUCTO_PEDIDO) VALUES
(1, 15, 1, 115),
(1, 17, 1, 117),
(1, 20, 10, 120),
(2, 15, 1, 215),
(2, 17, 1, 217),
(2, 21, 3, 221),
(3, 13, 1, 313),
(3, 14, 1, 314),
(3, 16, 1, 316),
(3, 18, 8, 318),
(3, 19, 5, 319),
(4, 18, 5, 418);
