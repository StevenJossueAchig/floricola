CREATE DATABASE bitciencia;
USE bitciencia;

-- Tabla sucursal
CREATE TABLE sucursal (
    ID_SUCURSAL INT NOT NULL PRIMARY KEY,
    NOMBRE VARCHAR(100),
    DIRECCION VARCHAR(255)
);

-- Tabla usuario
CREATE TABLE usuario (
    ID_USUARIO INT NOT NULL PRIMARY KEY,
    ID_SUCURSAL INT,
    USUARIO VARCHAR(50) UNIQUE,  -- <--- Esto asegura que no se repita
    CONTRASENA VARCHAR(100),
    NOMBRES VARCHAR(100),
    APELLIDOS VARCHAR(100),
    TELEFONO VARCHAR(20),
    CORREO_ELECTRONICO VARCHAR(50),
    ROL VARCHAR(50),
    FOREIGN KEY (ID_SUCURSAL) REFERENCES sucursal(ID_SUCURSAL)
);


-- Tabla pedido
CREATE TABLE pedido (
    ID_PEDIDO INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ID_USUARIO INT,
    FECHA_PEDIDO DATE,
    FECHA_ENTREGA DATE,
    estado VARCHAR(50),
    FOREIGN KEY (ID_USUARIO) REFERENCES usuario(ID_USUARIO)
);

-- Tabla producto
CREATE TABLE PRODUCTO (
  ID_PRODUCTO INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  TIPO VARCHAR(50) NOT NULL,
  VARIEDAD VARCHAR(50) NOT NULL,
  COLOR VARCHAR(50) NOT NULL,
  DESCRIPCION VARCHAR(250),
  TOP_PICTURE MEDIUMTEXT,
  SIDE_PICTURE MEDIUMTEXT,
  LONGITUD_DISPONIBLE_CM_ VARCHAR(25),
  TIEMPO_DE_VIDA_DIAS_ VARCHAR(10),
  TAMANO_FLOR FLOAT,
  ESPINAS SMALLINT,
  PETALOS_POR_FLOR INT,
  STOCK INT,
  FECHA_INGRESO DATE,
  PRECIO DECIMAL(10,2)
);

-- Tabla incluye
CREATE TABLE incluye (
    ID_PRODUCTO_PEDIDO INT NOT NULL PRIMARY KEY,
    ID_PRODUCTO INT,
    ID_PEDIDO INT,
    CANTIDAD INT,
    FOREIGN KEY (ID_PRODUCTO) REFERENCES producto(ID_PRODUCTO),
    FOREIGN KEY (ID_PEDIDO) REFERENCES pedido(ID_PEDIDO)
);


INSERT INTO sucursal (ID_SUCURSAL, NOMBRE, DIRECCION) VALUES
(1, 'Sucursal 1', 'Colonche Y Chilibulo, OE10-12'),
(2, 'Sucursal 3', 'Colon y 6 de Diciembre'),
(3, 'Sucursal 2', 'Rodrigo de Chavez y Av. Napo'),
(4, 'Sucursal 4', 'Sangolqui'),
(5, 'Sucursal 5', 'El Quinche'),
(6, 'Sucursal 6', 'Mariscal Sucre y Michelena');


INSERT INTO usuario (ID_USUARIO, ID_SUCURSAL, USUARIO, CONTRASENA, NOMBRES, APELLIDOS, TELEFONO, CORREO_ELECTRONICO, ROL) VALUES
(1, NULL, 'admin', '$2a$10$Ukt6yPpPLE6qwKU5crDrW.VcVPhb/vtOlbrhOn922bOEcrFlaj5jG', 'admin', 'admin', '0996388431', 'admin@gmail.com', 'Admin'),
(6, 2, 'David', '$2a$10$F31NlXMgLNRiKC5XOfTZJOCoYTQPTd5C8vFM5ZPIkO9sVauweCCXK', 'David', 'Leal', '0123456789', 'correo@falso.com', 'Usuario'),
(7, 1, 'steven', '$2a$10$Zhp/vqrFyQEk6N7wI9qhxO..G0wNWt9NWd970Rkn5NYerXkX9xwlC', 'Steven', 'Achig', '0998476747', 'stevenjossue5@gmail.com', 'Admin'),
(8, 4, 'genesis', '$2a$10$UMtvdrO3dQg8whkHUomUIuAeO5uk5bwp4RxEv6S88falW89nmFOUe', 'Genesis', 'Ruales', '8408949', 'Genesis@gmail.com', 'Usuario'),
(9, 2, 'kevinandrade', '$2a$10$SSwrxCg0AGdnIY9aFOdnROGW9ZeaVSstTVqMlRGeqTq76rhlPhkfG', 'Kevin', 'Andrade', '0998647585', 'kevinandrade@gmail.com', 'Usuario'),
(10, 3, 'Lola', '$2a$10$FT/3t0CdPRTlLH9xE76.G.C3QxHWPk8YPcFS8DLa9Nv0a7LByXCRa', 'Lola', 'Lolita', '1234567890', 'Lola@amor.com', 'Usuario');


INSERT INTO producto (
  ID_PRODUCTO, TIPO, VARIEDAD, COLOR, DESCRIPCION,
  TOP_PICTURE, SIDE_PICTURE, LONGITUD_DISPONIBLE_CM_,
  TIEMPO_DE_VIDA_DIAS_, TAMANO_FLOR, ESPINAS,
  PETALOS_POR_FLOR, STOCK, FECHA_INGRESO, PRECIO
) VALUES
(1, 'Rose', 'Alba', 'White', 'White',
 'https://fincasderosas.com/wp-content/uploads/2020/12/rosa-alba1.jpg',
 'https://floramarket.es/wp-content/uploads/2022/03/rosa-alba-1.png',
 '50 - 60', '14-20', 6.5, 8, 60, 130, '2025-06-30', 1.20),
(2, 'Rose', 'Altamira', 'Novelty', 'Cherry/Red',
 'https://www.staroses.com/wp-content/uploads/2020/02/altamira2-1.jpg',
 'https://www.staroses.com/wp-content/uploads/2020/02/altamira2-1.jpg',
 '40 - 70', '16-20', 5.4, 1, 56, 385, '2025-07-01', 1.40),
(3, 'Roses', 'Amorosas', 'Pink', 'Medium Pink',
 'https://297820.selcdn.ru/crm1/images/species/4144.jpg?=2023-12-01+06%3A28%3A39',
 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf9akiiFj_LJvhjSodQjLh6eTd37YmykH6xnm-M6eDaeohen-7RuR4pHXHW19Y4514q4o&usqp=CAU',
 '60 - 90', '5-10', 6.0, 1, 30, 99, '2025-07-04', 1.10),
(4, 'Rose', 'Gerbera', 'Fucsia', 'Pink Petales',
 'https://cdn.pixabay.com/photo/2016/04/20/21/17/png-1342113_1280.png',
 'https://www.thecolvinco.com/es/c/wp-content/uploads/2020/06/gerbera_red-1024x1024.jpg',
 '60 - 80', '15-35', 5.5, 0, 35, 19, '2025-06-24', 1.30),
(6, 'Tulipán', 'Golden Apeldoorn', 'Amarillo', 'Tulipán amarillo vibrante ideal para arreglos florales.',
 'https://enviodeflores.cl/1885-medium_default/tulipanes-amarillos.jpg',
 'https://almacenesmarriott.com/wp-content/uploads/2024/01/S20258__1.jpg',
 '60 - 100', '15-25', 7.5, 0, 50, 90, '2025-06-24', 0.85);

INSERT INTO pedido (ID_PEDIDO, ID_USUARIO, FECHA_PEDIDO, FECHA_ENTREGA, estado) VALUES
(13, 8, '2024-08-19', '2024-08-20', 'ENTREGADO'),
(14, 8, '2024-08-20', '2024-08-21', 'CANCELADO'),
(15, 8, '2024-08-20', '2024-08-21', 'ENTREGADO'),
(16, 8, '2024-08-20', '2024-08-21', 'ENTREGADO'),
(17, 8, '2024-08-20', '2024-08-21', 'ENTREGADO'),
(18, 8, '2024-09-17', '2024-09-18', 'ENTREGADO'),
(19, 8, '2025-05-20', '2025-05-21', 'ENTREGADO'),
(20, 10, '2025-05-27', '2025-05-28', 'ENTREGADO'),
(21, 10, '2025-05-27', '2025-05-28', 'PENDIENTE'),
(22, 8, '2025-06-24', '2025-06-25', 'ENTREGADO'),
(23, 8, '2025-06-24', '2025-06-25', 'CANCELADO'),
(24, 8, '2025-06-24', '2025-06-26', 'ENTREGADO'),
(25, 8, '2025-06-25', '2025-06-26', 'CANCELADO'),
(26, 8, '2025-06-28', '2025-06-30', 'ENTREGADO'),
(27, 8, '2025-07-09', '2025-07-10', 'PENDIENTE');

INSERT INTO incluye (ID_PRODUCTO_PEDIDO, ID_PRODUCTO, ID_PEDIDO, CANTIDAD) VALUES
(115, 1, 15, 1),
(117, 1, 17, 1),
(120, 1, 20, 10),
(124, 1, 24, 10),
(215, 2, 15, 1),
(217, 2, 17, 1),
(221, 2, 21, 3),
(222, 2, 22, 7),
(224, 2, 24, 100),
(225, 2, 25, 90),
(226, 2, 26, 5),
(313, 3, 13, 1),
(314, 3, 14, 1),
(316, 3, 16, 1),
(318, 3, 18, 8),
(319, 3, 19, 5),
(322, 3, 22, 2),
(324, 3, 24, 5),
(327, 3, 27, 1),
(418, 4, 18, 5),
(422, 4, 22, 5),
(423, 4, 23, 5),
(424, 4, 24, 5),
(425, 4, 25, 5),
(426, 4, 26, 5),
(622, 6, 22, 10),
(625, 6, 25, 5);
