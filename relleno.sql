-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: base
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `reserva`
--

DROP TABLE IF EXISTS `reserva`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reserva` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cliente_presencial` varchar(255) DEFAULT NULL,
  `fechayhora` datetime(6) DEFAULT NULL,
  `num_tlfno` varchar(255) DEFAULT NULL,
  `cliente_online_id` bigint DEFAULT NULL,
  `servicio_id` bigint DEFAULT NULL,
  `trabajador_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKb3doark5ggf28mxanthq1myrc` (`cliente_online_id`),
  KEY `FKi7yl9d2x9vvljr0knw2952v45` (`trabajador_id`),
  KEY `FKkb2hduaa5nxmpky7kiiiw1ab0` (`servicio_id`),
  CONSTRAINT `FKb3doark5ggf28mxanthq1myrc` FOREIGN KEY (`cliente_online_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `FKi7yl9d2x9vvljr0knw2952v45` FOREIGN KEY (`trabajador_id`) REFERENCES `trabajadores` (`id`),
  CONSTRAINT `FKkb2hduaa5nxmpky7kiiiw1ab0` FOREIGN KEY (`servicio_id`) REFERENCES `servicios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reserva`
--

LOCK TABLES `reserva` WRITE;
/*!40000 ALTER TABLE `reserva` DISABLE KEYS */;
INSERT INTO `reserva` VALUES (1,NULL,'2025-03-31 09:30:00.000000',NULL,2,1,1),(2,NULL,'2025-03-31 10:15:00.000000',NULL,3,4,1),(3,NULL,'2025-03-31 09:45:00.000000',NULL,4,5,2),(4,'Paula','2025-03-31 09:45:00.000000','623559874',NULL,2,3),(5,NULL,'2025-04-02 09:30:00.000000',NULL,2,4,1),(7,NULL,'2025-04-03 10:45:00.000000',NULL,3,2,1),(8,NULL,'2025-04-02 09:30:00.000000',NULL,3,3,2),(9,NULL,'2025-04-02 09:30:00.000000',NULL,4,6,3),(10,NULL,'2025-04-03 10:00:00.000000',NULL,4,6,1),(12,'andrea','2025-04-04 10:15:00.000000','698745230',NULL,6,3),(14,NULL,'2025-04-07 10:30:00.000000',NULL,2,2,3),(15,'Paula','2025-04-04 09:45:00.000000','65986720',NULL,1,3),(16,NULL,'2025-04-08 10:00:00.000000',NULL,2,1,1),(17,NULL,'2025-04-09 09:45:00.000000',NULL,2,2,1),(18,'Paula','2025-04-04 10:00:00.000000','658972304',NULL,2,2),(19,NULL,'2025-04-04 10:00:00.000000',NULL,5,2,1);
/*!40000 ALTER TABLE `reserva` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicios`
--

DROP TABLE IF EXISTS `servicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicios` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre_servicio` varchar(255) NOT NULL,
  `duracion` int NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre_servicio` (`nombre_servicio`),
  UNIQUE KEY `UKavpcd1okoipoyligcded6m0ac` (`nombre_servicio`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicios`
--

LOCK TABLES `servicios` WRITE;
/*!40000 ALTER TABLE `servicios` DISABLE KEYS */;
INSERT INTO `servicios` VALUES (1,'Corte de Pelo',30,25.00,'/img/cortepelo.jpg'),(2,'Manicura',45,25.00,'/img/Manicura.jpg'),(3,'Tinte de Pelo',60,50.00,'/img/tinte de pelo.jpg'),(4,'Depilaci├│n Cera',45,30.00,'/img/depilacion.jpg'),(5,'Peinado',30,15.00,'/img/peinados.jpg'),(6,'Maquillaje',30,25.00,'/img/Maquillaje.jpg');
/*!40000 ALTER TABLE `servicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trabajadores`
--

DROP TABLE IF EXISTS `trabajadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trabajadores` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trabajadores`
--

LOCK TABLES `trabajadores` WRITE;
/*!40000 ALTER TABLE `trabajadores` DISABLE KEYS */;
INSERT INTO `trabajadores` VALUES (1,'Laura P├®rez','659874651'),(2,'Beatriz Rodr├¡guez','659874652'),(3,'Andrea Mart├¡nez','659874653');
/*!40000 ALTER TABLE `trabajadores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `tipo` enum('ADMINISTRADOR','CLIENTE_ONLINE') NOT NULL DEFAULT 'CLIENTE_ONLINE',
  `avatar` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Admin','admin@admin.com','admin1212','916598746','ADMINISTRADOR','/img/admin.png'),(2,'Ana','ana@mail.com','ana1212','','CLIENTE_ONLINE','/img/avatar2.png'),(3,'jimena','jim@gmail.com','jim1212','','CLIENTE_ONLINE','/img/avatar2.png'),(4,'roc├¡o','ro@gmail.com','ro1212','','CLIENTE_ONLINE','/img/avatar2.png'),(5,'Marta','marta@mail.com','marta1212','','CLIENTE_ONLINE','/img/avatar1.png');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `valoraciones`
--

DROP TABLE IF EXISTS `valoraciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `valoraciones` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `comentario` varchar(255) DEFAULT NULL,
  `estrellas` int NOT NULL,
  `fecha` datetime(6) DEFAULT NULL,
  `reserva_id` bigint NOT NULL,
  `servicio_id` bigint NOT NULL,
  `usuario_id` bigint NOT NULL,
  `respuesta_admin` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKccjhrn3t7m24jw3jwq7dsqu7h` (`reserva_id`),
  KEY `FK1mxv9l51vuep8pab7emnio67n` (`servicio_id`),
  KEY `FKmtbedrv2q0wjdsrvnb57g8whw` (`usuario_id`),
  CONSTRAINT `FK1mxv9l51vuep8pab7emnio67n` FOREIGN KEY (`servicio_id`) REFERENCES `servicios` (`id`),
  CONSTRAINT `FKccjhrn3t7m24jw3jwq7dsqu7h` FOREIGN KEY (`reserva_id`) REFERENCES `reserva` (`id`),
  CONSTRAINT `FKmtbedrv2q0wjdsrvnb57g8whw` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `valoraciones`
--

LOCK TABLES `valoraciones` WRITE;
/*!40000 ALTER TABLE `valoraciones` DISABLE KEYS */;
INSERT INTO `valoraciones` VALUES (1,NULL,5,'2025-04-03 17:16:37.488558',1,1,2,'muchas gracias!'),(2,'ha sido genial :)',4,'2025-04-03 17:51:21.365467',5,4,2,'nos alegramos Ana!'),(3,'ha quedado genial!',5,'2025-04-03 18:03:35.689096',8,3,3,NULL),(4,'Maravilloso! ',4,'2025-04-03 18:04:31.902294',9,6,4,NULL);
/*!40000 ALTER TABLE `valoraciones` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-03 18:38:06
