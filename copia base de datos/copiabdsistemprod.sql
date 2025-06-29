CREATE DATABASE  IF NOT EXISTS `bdreencauche` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `bdreencauche`;
-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: bdreencauche
-- ------------------------------------------------------
-- Server version	8.0.33

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
-- Table structure for table `bandas`
--

DROP TABLE IF EXISTS `bandas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bandas` (
  `id_banda` smallint unsigned NOT NULL AUTO_INCREMENT,
  `banda` varchar(20) NOT NULL,
  PRIMARY KEY (`id_banda`),
  UNIQUE KEY `id_disenio_UNIQUE` (`id_banda`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id_cliente` mediumint unsigned NOT NULL AUTO_INCREMENT,
  `cedula_nit` bigint unsigned NOT NULL,
  `dv` tinyint DEFAULT NULL,
  `nombre` varchar(45) NOT NULL,
  `apellido` varchar(45) NOT NULL,
  `telefono` varchar(10) NOT NULL,
  `direccion` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contrasenia` varchar(128) NOT NULL,
  `estado` varchar(1) NOT NULL,
  `temporal` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `cedula_nit_UNIQUE` (`cedula_nit`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `data`
--

DROP TABLE IF EXISTS `data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `data` (
  `id` int NOT NULL,
  `eslogan` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dimensiones`
--

DROP TABLE IF EXISTS `dimensiones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dimensiones` (
  `id_dimension` smallint unsigned NOT NULL AUTO_INCREMENT,
  `dimension` varchar(20) NOT NULL,
  PRIMARY KEY (`id_dimension`),
  UNIQUE KEY `id_dimension_UNIQUE` (`id_dimension`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `empleados`
--

DROP TABLE IF EXISTS `empleados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleados` (
  `id_empleado` mediumint unsigned NOT NULL AUTO_INCREMENT,
  `cedula` bigint unsigned NOT NULL,
  `nombre` varchar(45) NOT NULL,
  `apellido` varchar(45) NOT NULL,
  `telefono` varchar(10) NOT NULL,
  `direccion` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `id_perfil` tinyint unsigned NOT NULL,
  `contrasenia` varchar(128) NOT NULL,
  `estado` varchar(1) NOT NULL,
  `temporal` tinyint NOT NULL DEFAULT '1',
  `cod_recuperacion` varchar(6) DEFAULT NULL,
  `cod_expiracion` datetime DEFAULT NULL,
  PRIMARY KEY (`id_empleado`),
  UNIQUE KEY `id_empleado_UNIQUE` (`id_empleado`),
  UNIQUE KEY `cedula_UNIQUE` (`cedula`),
  KEY `id_perfil` (`id_perfil`) /*!80000 INVISIBLE */,
  CONSTRAINT `id_perfil` FOREIGN KEY (`id_perfil`) REFERENCES `perfiles` (`id_perfil`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `garantias`
--

DROP TABLE IF EXISTS `garantias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `garantias` (
  `id_garantia` int unsigned NOT NULL AUTO_INCREMENT,
  `llanta` int unsigned NOT NULL,
  `docu_garan` mediumint unsigned NOT NULL,
  `fecha_entra` date NOT NULL,
  `cliente` mediumint unsigned NOT NULL,
  `resol_g` smallint unsigned DEFAULT NULL,
  `ajustable` tinyint unsigned DEFAULT NULL,
  `porcentaje` tinyint unsigned DEFAULT NULL,
  `fecha_resol` date DEFAULT NULL,
  PRIMARY KEY (`id_garantia`),
  KEY `id_llanta_idx` (`llanta`),
  KEY `id_cliente_idx` (`cliente`),
  KEY `id_resol_g_idx` (`resol_g`),
  CONSTRAINT `cliente` FOREIGN KEY (`cliente`) REFERENCES `clientes` (`id_cliente`),
  CONSTRAINT `llanta` FOREIGN KEY (`llanta`) REFERENCES `llantas` (`id_llanta`),
  CONSTRAINT `resol_g` FOREIGN KEY (`resol_g`) REFERENCES `resoluciones_g` (`id_resol_g`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `llantas`
--

DROP TABLE IF EXISTS `llantas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `llantas` (
  `id_llanta` int unsigned NOT NULL,
  `id_marca` smallint unsigned NOT NULL,
  `id_dimension` smallint unsigned NOT NULL,
  `id_banda` smallint unsigned NOT NULL,
  `serie` smallint unsigned NOT NULL,
  `orden` int unsigned NOT NULL,
  `consec_orden` tinyint unsigned NOT NULL,
  `ubicacion` varchar(1) NOT NULL,
  `doc_sale` mediumint unsigned DEFAULT NULL COMMENT 'documento de salida de producción',
  `tipo_doc_sale` tinyint unsigned DEFAULT NULL COMMENT 'tipo de documento salida de producción',
  `fecha_sale` date DEFAULT NULL,
  `doc_entrega` mediumint unsigned DEFAULT NULL COMMENT 'número documento de entrega al cliente',
  `tipo_doc_entrega` tinyint unsigned DEFAULT NULL COMMENT 'Tipo de documento de entrega al cliente, factura o remisión rechazo',
  `valor` mediumint unsigned DEFAULT NULL,
  `impuesto` tinyint unsigned DEFAULT NULL,
  `id_comprador` mediumint unsigned DEFAULT NULL,
  `fecha_entrega` date DEFAULT NULL COMMENT 'Fecha de entrega de la llanta al cliente',
  PRIMARY KEY (`id_llanta`),
  KEY `orden_idx` (`orden`),
  KEY `id_comprador_idx` (`id_comprador`),
  KEY `id_marca_idx` (`id_marca`),
  KEY `id_dimension_idx` (`id_dimension`),
  KEY `id_banda_idx` (`id_banda`),
  CONSTRAINT `id_banda` FOREIGN KEY (`id_banda`) REFERENCES `bandas` (`id_banda`),
  CONSTRAINT `id_comprador` FOREIGN KEY (`id_comprador`) REFERENCES `clientes` (`id_cliente`),
  CONSTRAINT `id_dimension` FOREIGN KEY (`id_dimension`) REFERENCES `dimensiones` (`id_dimension`),
  CONSTRAINT `id_marca` FOREIGN KEY (`id_marca`) REFERENCES `marcas` (`id_marca`),
  CONSTRAINT `orden` FOREIGN KEY (`orden`) REFERENCES `ordenes` (`id_orden`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `marcas`
--

DROP TABLE IF EXISTS `marcas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `marcas` (
  `id_marca` smallint unsigned NOT NULL AUTO_INCREMENT,
  `marca` varchar(20) NOT NULL,
  PRIMARY KEY (`id_marca`),
  UNIQUE KEY `id_marca_UNIQUE` (`id_marca`),
  UNIQUE KEY `marca_UNIQUE` (`marca`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ordenes`
--

DROP TABLE IF EXISTS `ordenes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordenes` (
  `id_orden` int unsigned NOT NULL,
  `fecha` date NOT NULL,
  `id_cliente` mediumint unsigned NOT NULL,
  PRIMARY KEY (`id_orden`),
  KEY `id_cliente_idx` (`id_cliente`) /*!80000 INVISIBLE */,
  CONSTRAINT `id_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `perfiles`
--

DROP TABLE IF EXISTS `perfiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `perfiles` (
  `id_perfil` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `perfil` varchar(45) NOT NULL,
  `descripcion` varchar(120) DEFAULT NULL,
  PRIMARY KEY (`id_perfil`),
  UNIQUE KEY `id_perfil_UNIQUE` (`id_perfil`),
  UNIQUE KEY `perfil_nombre_UNIQUE` (`perfil`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `permisos`
--

DROP TABLE IF EXISTS `permisos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permisos` (
  `id_permisos` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `nombre_permiso` varchar(20) NOT NULL,
  `descripcion_permiso` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_permisos`),
  UNIQUE KEY `id_permisos_UNIQUE` (`id_permisos`),
  UNIQUE KEY `nombre_permiso_UNIQUE` (`nombre_permiso`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `permisos_perfiles`
--

DROP TABLE IF EXISTS `permisos_perfiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permisos_perfiles` (
  `permiso` tinyint unsigned NOT NULL,
  `perfil` tinyint unsigned NOT NULL,
  PRIMARY KEY (`perfil`,`permiso`),
  KEY `id_perfil_idx` (`perfil`) /*!80000 INVISIBLE */,
  KEY `id_permiso_idx` (`permiso`),
  CONSTRAINT `perfil` FOREIGN KEY (`perfil`) REFERENCES `perfiles` (`id_perfil`),
  CONSTRAINT `permiso` FOREIGN KEY (`permiso`) REFERENCES `permisos` (`id_permisos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `procesos`
--

DROP TABLE IF EXISTS `procesos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `procesos` (
  `id_proceso` int NOT NULL AUTO_INCREMENT,
  `id_llanta` int unsigned NOT NULL,
  `estado` varchar(12) NOT NULL,
  `nivel_r` tinyint unsigned DEFAULT '0',
  `id_inspec` smallint unsigned DEFAULT NULL,
  `ancho` smallint unsigned DEFAULT NULL COMMENT 'Ancho de la llanta en mm',
  `perimetro` smallint unsigned DEFAULT NULL,
  `radio_r` smallint unsigned DEFAULT NULL COMMENT 'Radio de raspado en pulgadas',
  `id_ins_inicial` mediumint unsigned DEFAULT NULL,
  `time_ins_inicial` datetime DEFAULT NULL,
  `id_raspado` mediumint unsigned DEFAULT NULL,
  `time_raspado` datetime DEFAULT NULL,
  `id_preparacion` mediumint unsigned DEFAULT NULL,
  `time_preparacion` datetime DEFAULT NULL,
  `id_relleno` mediumint unsigned DEFAULT NULL,
  `time_relleno` datetime DEFAULT NULL,
  `id_corte` mediumint unsigned DEFAULT NULL,
  `time_corte` datetime DEFAULT NULL,
  `id_embandado` mediumint unsigned DEFAULT NULL,
  `time_embandado` datetime DEFAULT NULL,
  `id_vulacanizado` mediumint unsigned DEFAULT NULL,
  `time_vulcanizado` datetime DEFAULT NULL,
  `id_ins_final` mediumint unsigned DEFAULT NULL,
  `time_ins_final` datetime DEFAULT NULL,
  PRIMARY KEY (`id_proceso`),
  KEY `id_llanta_idx` (`id_llanta`) /*!80000 INVISIBLE */,
  KEY `id_ins_inicial_idx` (`id_ins_inicial`),
  KEY `id_raspado_idx` (`id_raspado`),
  KEY `id_preparacion_idx` (`id_preparacion`),
  KEY `id_relleno_idx` (`id_relleno`),
  KEY `id_corte_idx` (`id_corte`),
  KEY `id_embandado_idx` (`id_embandado`),
  KEY `id_vulcanizado_idx` (`id_vulacanizado`) /*!80000 INVISIBLE */,
  KEY `id_ins_final_idx` (`id_ins_final`),
  KEY `id_inspec_idx` (`id_inspec`),
  CONSTRAINT `id_corte` FOREIGN KEY (`id_corte`) REFERENCES `empleados` (`id_empleado`),
  CONSTRAINT `id_embandado` FOREIGN KEY (`id_embandado`) REFERENCES `empleados` (`id_empleado`),
  CONSTRAINT `id_ins_final` FOREIGN KEY (`id_ins_final`) REFERENCES `empleados` (`id_empleado`),
  CONSTRAINT `id_ins_inicial` FOREIGN KEY (`id_ins_inicial`) REFERENCES `empleados` (`id_empleado`),
  CONSTRAINT `id_inspec` FOREIGN KEY (`id_inspec`) REFERENCES `resoluciones_i` (`id_inspec`),
  CONSTRAINT `id_llanta` FOREIGN KEY (`id_llanta`) REFERENCES `llantas` (`id_llanta`),
  CONSTRAINT `id_preparacion` FOREIGN KEY (`id_preparacion`) REFERENCES `empleados` (`id_empleado`),
  CONSTRAINT `id_raspado` FOREIGN KEY (`id_raspado`) REFERENCES `empleados` (`id_empleado`),
  CONSTRAINT `id_relleno` FOREIGN KEY (`id_relleno`) REFERENCES `empleados` (`id_empleado`),
  CONSTRAINT `id_vulcanizado` FOREIGN KEY (`id_vulacanizado`) REFERENCES `empleados` (`id_empleado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `resoluciones_g`
--

DROP TABLE IF EXISTS `resoluciones_g`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resoluciones_g` (
  `id_resol_g` smallint unsigned NOT NULL AUTO_INCREMENT,
  `codigo` varchar(2) DEFAULT NULL,
  `resol_garan` varchar(45) NOT NULL,
  PRIMARY KEY (`id_resol_g`),
  UNIQUE KEY `id_resol_g_UNIQUE` (`id_resol_g`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `resoluciones_i`
--

DROP TABLE IF EXISTS `resoluciones_i`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resoluciones_i` (
  `id_inspec` smallint unsigned NOT NULL AUTO_INCREMENT,
  `codigo` varchar(2) DEFAULT NULL,
  `resol_inspec` varchar(45) NOT NULL,
  PRIMARY KEY (`id_inspec`),
  UNIQUE KEY `id_inspec_UNIQUE` (`id_inspec`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-20 20:11:51
