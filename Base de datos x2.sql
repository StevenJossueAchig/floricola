CREATE DATABASE  IF NOT EXISTS `floricola` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `floricola`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: floricola
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `incluye`
--

DROP TABLE IF EXISTS `incluye`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incluye` (
  `ID_PRODUCTO` int NOT NULL,
  `ID_PEDIDO` int NOT NULL,
  `CANTIDAD` int DEFAULT NULL,
  `ID_PRODUCTO_PEDIDO` char(10) NOT NULL,
  PRIMARY KEY (`ID_PRODUCTO_PEDIDO`),
  UNIQUE KEY `INCLUYE_PK` (`ID_PRODUCTO_PEDIDO`),
  KEY `INCLUYE2_FK` (`ID_PEDIDO`),
  KEY `INCLUYE_FK` (`ID_PRODUCTO`),
  CONSTRAINT `FK_INCLUYE_INCLUYE2_PEDIDO` FOREIGN KEY (`ID_PEDIDO`) REFERENCES `pedido` (`ID_PEDIDO`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_INCLUYE_INCLUYE_PRODUCTO` FOREIGN KEY (`ID_PRODUCTO`) REFERENCES `producto` (`ID_PRODUCTO`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incluye`
--

LOCK TABLES `incluye` WRITE;
/*!40000 ALTER TABLE `incluye` DISABLE KEYS */;
INSERT INTO `incluye` VALUES (2,12,14,'212');
/*!40000 ALTER TABLE `incluye` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido`
--

DROP TABLE IF EXISTS `pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido` (
  `ID_PEDIDO` int NOT NULL AUTO_INCREMENT,
  `ID_USUARIO` int DEFAULT NULL,
  `FECHA_PEDIDO` date DEFAULT NULL,
  `FECHA_ENTREGA` date DEFAULT NULL,
  `estado` char(10) DEFAULT NULL,
  PRIMARY KEY (`ID_PEDIDO`),
  UNIQUE KEY `PEDIDO_PK` (`ID_PEDIDO`),
  KEY `REALIZAR_FK` (`ID_USUARIO`),
  CONSTRAINT `FK_PEDIDO_REALIZAR_USUARIO` FOREIGN KEY (`ID_USUARIO`) REFERENCES `usuario` (`ID_USUARIO`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido`
--

LOCK TABLES `pedido` WRITE;
/*!40000 ALTER TABLE `pedido` DISABLE KEYS */;
INSERT INTO `pedido` VALUES (12,6,'2024-08-19','2024-08-20','CANCELADO');
/*!40000 ALTER TABLE `pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto` (
  `ID_PRODUCTO` int NOT NULL AUTO_INCREMENT,
  `TIPO` varchar(50) DEFAULT NULL,
  `VARIEDAD` varchar(50) DEFAULT NULL,
  `COLOR` varchar(50) DEFAULT NULL,
  `DESCRIPCION` varchar(250) DEFAULT NULL,
  `TOP_PICTURE` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `SIDE_PICTURE` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `LONGITUD_DISPONIBLE_CM_` varchar(25) DEFAULT NULL,
  `TIEMPO_DE_VIDA_DIAS_` varchar(10) DEFAULT NULL,
  `TAMANO_FLOR` float DEFAULT NULL,
  `ESPINAS` smallint DEFAULT NULL,
  `PETALOS_POR_FLOR` int DEFAULT NULL,
  `STOCK` int DEFAULT NULL,
  PRIMARY KEY (`ID_PRODUCTO`),
  UNIQUE KEY `PRODUCTO_PK` (`ID_PRODUCTO`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
INSERT INTO `producto` VALUES (1,'Rose','Alba','White','White','https://tessacorporation.com/wp-content/uploads/2017/10/Alba-3.jpg','https://floramarket.es/wp-content/uploads/2022/03/rosa-alba-1.png','50 to 90','14-18',6.5,1,47,100),(2,'Rose','Altamira','Novelty','Cherry/Red','https://www.staroses.com/wp-content/uploads/2020/02/altamira2-1.jpg','https://www.staroses.com/wp-content/uploads/2020/02/altamira2-1.jpg','40 to 70','16-20',5.8,1,56,100),(3,'Rose','Amorosa','Pink','Medium Pink','https://297820.selcdn.ru/crm1/images/species/4144.jpg?=2023-12-01+06%3A28%3A39','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf9akiiFj_LJvhjSodQjLh6eTd37YmykH6xnm-M6eDaeohen-7RuR4pHXHW19Y4514q4o&usqp=CAU','60 to 90','16-20',6.8,1,52,100);
/*!40000 ALTER TABLE `producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sucursal`
--

DROP TABLE IF EXISTS `sucursal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sucursal` (
  `ID_SUCURSAL` int NOT NULL,
  `NOMBRE` varchar(50) DEFAULT NULL,
  `DIRECCION` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID_SUCURSAL`),
  UNIQUE KEY `SUCURSAL_PK` (`ID_SUCURSAL`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sucursal`
--

LOCK TABLES `sucursal` WRITE;
/*!40000 ALTER TABLE `sucursal` DISABLE KEYS */;
INSERT INTO `sucursal` VALUES (1,'Sucursal 1','Dirección prueba, Calee Prueba OE-799 y Avenida prueba'),(2,'Sucursal 3','Calle nueva'),(3,'Sucursal 2','Calle nueva'),(4,'Sucursal 4','5'),(5,'Sucursal 5','Calle nueva');
/*!40000 ALTER TABLE `sucursal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `ID_USUARIO` int NOT NULL,
  `ID_SUCURSAL` int DEFAULT NULL,
  `USUARIO` varchar(50) DEFAULT NULL,
  `CONTRASENA` varchar(100) DEFAULT NULL,
  `NOMBRES` varchar(100) DEFAULT NULL,
  `APELLIDOS` varchar(100) DEFAULT NULL,
  `TELEFONO` varchar(10) DEFAULT NULL,
  `CORREO_ELECTRONICO` varchar(50) DEFAULT NULL,
  `ROL` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID_USUARIO`),
  UNIQUE KEY `USUARIO_PK` (`ID_USUARIO`),
  KEY `PERTENECE_FK` (`ID_SUCURSAL`),
  KEY `IDX_USUARIO` (`USUARIO`),
  CONSTRAINT `FK_USUARIO_PERTENECE_SUCURSAL` FOREIGN KEY (`ID_SUCURSAL`) REFERENCES `sucursal` (`ID_SUCURSAL`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (2,NULL,'admin','$2a$10$NCkZvAwSeySEslNkRlryluWhzolE3ElDwqKYYl1Ch2k0znQ6ruo9y','admin','admin','0996388431','admin@gmail.com','Admin'),(3,NULL,'genesis','$2a$10$mLxMiRAddd2SO0m2AzBxo.a6Iui6bL75kPbZ.yxfI/Xo6BqW.qXp2','Genesis Isabel','Calapaqui Portilla','0987058451','genesiscalapaquip@gmail.com','Usuario'),(4,2,'admin3','$2a$10$nF03xhHW0njuiYzFmPAOB..AZZQCY/w.cAhpGup4BiBnstMtuhwKa','Genesis Isabel','Calapaqui Portilla','0987058451','genesiscalapaquip3@gmail.com','Usuario'),(5,1,'admin4','$2a$10$b3cA1RAKW4UkTnktPS7eVeGFbPJCSsy950lT.06RWF2hO9VwH4DOe','Genesis Isabel','Calapaqui Portilla','0987058451','genesiscalapaquip4@gmail.com','Usuario'),(6,2,'David','$2a$10$F31NlXMgLNRiKC5XOfTZJOCoYTQPTd5C8vFM5ZPIkO9sVauweCCXK','David','Leal','0123456789','correo@falso.com','Usuario'),(7,4,'Otro','$2a$10$umsMlvF3AanEMdHr7HmWAOMhomdoAjbH6JPAYlRDq5/qIzcoA8Bta','Otro','Usuario','9876543210','otro@user.com','Usuario');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-19  3:30:36
