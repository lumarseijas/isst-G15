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
-- Table structure for table `dia_no_disponible`
--

DROP TABLE IF EXISTS `dia_no_disponible`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dia_no_disponible` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fecha` date DEFAULT NULL,
  `trabajador_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKik9moi0xe884tu2urh6vke1w6` (`trabajador_id`),
  CONSTRAINT `FKik9moi0xe884tu2urh6vke1w6` FOREIGN KEY (`trabajador_id`) REFERENCES `trabajadores` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dia_no_disponible`
--

LOCK TABLES `dia_no_disponible` WRITE;
/*!40000 ALTER TABLE `dia_no_disponible` DISABLE KEYS */;
INSERT INTO `dia_no_disponible` VALUES (1,'2025-04-10',1),(2,'2025-05-12',1);
/*!40000 ALTER TABLE `dia_no_disponible` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reserva`
--

LOCK TABLES `reserva` WRITE;
/*!40000 ALTER TABLE `reserva` DISABLE KEYS */;
INSERT INTO `reserva` VALUES (1,NULL,'2025-05-02 09:45:00.000000',NULL,2,1,2),(2,NULL,'2025-05-05 09:45:00.000000',NULL,2,8,1),(3,NULL,'2025-05-12 09:45:00.000000',NULL,2,4,3),(4,NULL,'2025-05-14 09:45:00.000000',NULL,2,3,3),(5,NULL,'2025-05-02 12:30:00.000000',NULL,2,5,1),(6,NULL,'2025-05-02 10:30:00.000000',NULL,3,2,3),(7,NULL,'2025-05-02 13:00:00.000000',NULL,3,6,3),(8,NULL,'2025-05-13 11:00:00.000000',NULL,3,5,3),(9,NULL,'2025-05-07 11:00:00.000000',NULL,3,5,2),(10,NULL,'2025-05-02 11:45:00.000000',NULL,3,8,2),(11,NULL,'2025-05-02 09:30:00.000000',NULL,4,3,3),(12,NULL,'2025-05-05 09:30:00.000000',NULL,4,2,2),(13,NULL,'2025-05-02 12:15:00.000000',NULL,4,1,3),(14,NULL,'2025-05-07 12:15:00.000000',NULL,4,6,3),(15,NULL,'2025-05-13 10:15:00.000000',NULL,4,1,2),(16,NULL,'2025-05-07 11:30:00.000000',NULL,5,5,2),(17,NULL,'2025-05-02 11:30:00.000000',NULL,5,6,1),(18,NULL,'2025-05-05 11:30:00.000000',NULL,5,4,2),(19,NULL,'2025-05-12 12:15:00.000000',NULL,5,6,4),(20,'Paula','2025-05-14 09:45:00.000000','659764530',NULL,8,2);
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicios`
--

LOCK TABLES `servicios` WRITE;
/*!40000 ALTER TABLE `servicios` DISABLE KEYS */;
INSERT INTO `servicios` VALUES (1,'Corte de Pelo',30,25.00,'/img/cortepelo.jpg'),(2,'Manicura',45,25.00,'/img/Manicura.jpg'),(3,'Tinte de Pelo',60,50.00,'/img/tinte de pelo.jpg'),(4,'Depilaci%%n Cera',45,30.00,'/img/depilacion.jpg'),(5,'Peinado',30,15.00,'/img/peinados.jpg'),(6,'Maquillaje',30,25.00,'/img/Maquillaje.jpg'),(8,'Limpieza facial',40,30.00,'https://clesteticamasculinabarcelona.com/wp-content/uploads/2024/10/Limpieza-facial-completa-2.jpg'),(12,'Masaje',30,25.00,'https://ambrosiaspabcn.com/wp-content/uploads/2020/03/Ambrosia_SPA_Masaje_relajante.jpg');
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trabajadores`
--

LOCK TABLES `trabajadores` WRITE;
/*!40000 ALTER TABLE `trabajadores` DISABLE KEYS */;
INSERT INTO `trabajadores` VALUES (1,'Laura P%rez','659874651'),(2,'Beatriz Rodr%guez','659874652'),(3,'Andrea Mart%nez','659874653'),(4,'Mar%a Castillo','648975632');
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
INSERT INTO `usuarios` VALUES (1,'Centro Belleza','centrobelleza2025@gmail.com','$2a$10$KvwKH0VR7LPhDeizpwRRn.9BQPOi.C4sPcQ2Swi7M4X4Mh7XwPdfK','91356987','ADMINISTRADOR','/img/admin.png'),(2,'jimena','jim@gmail.com','$2a$10$2Tg5yaysePmYx8AYm4o/vuhG7F0cq40gYgv5vMYW3udoZCyCvrAfe','','CLIENTE_ONLINE','/img/avatar1.png'),(3,'Ana','ana@mail.com','$2a$10$nK0eY1uL4AY8RLipZrgT3uP1bl0YbK1n7QE.8VGDde9.ku1ONUcTW','','CLIENTE_ONLINE','/img/avatar2.png'),(4,'Angela','angela@mail.com','$2a$10$bqfbTRQiUtqdaG5/IvKl/OWjzh2GkEsmpi4ZAQNlTWqHV.bXCszQm','','CLIENTE_ONLINE','/img/avatar1.png'),(5,'Marta Sanchez','mmartasanchezzz14@gmail.com','$2a$10$sso0wjm0SEB0Ynl85AJ5HOBA2BrDkE55WCw1qLS6N.VIlv7vZFJ5O','','CLIENTE_ONLINE','/img/avatar2.png');
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `valoraciones`
--

LOCK TABLES `valoraciones` WRITE;
/*!40000 ALTER TABLE `valoraciones` DISABLE KEYS */;
INSERT INTO `valoraciones` VALUES (1,NULL,5,'2025-04-03 17:16:37.488558',1,1,2,'muchas gracias!'),(2,'ha sido genial :)',4,'2025-04-03 17:51:21.365467',5,4,2,'nos alegramos Ana!'),(3,'ha quedado genial!',5,'2025-04-03 18:03:35.689096',8,3,3,NULL),(4,'Maravilloso! ',4,'2025-04-03 18:04:31.902294',9,6,4,NULL),(5,'El mejor centro de belleza!!',5,'2025-05-06 20:28:21.684701',6,2,3,'Reina'),(6,'Ha quedado genial!',5,'2025-05-06 20:28:40.485522',7,6,3,NULL),(7,'Laura es un encanto!',5,'2025-05-06 20:30:16.686074',17,6,5,NULL),(8,'Mejorable, pero muy bien',3,'2025-05-06 20:30:30.018874',18,4,5,'Tenemos en cuenta tu opini%%n! Gracias Marta!'),(9,'ole!',4,'2025-05-06 21:00:55.127771',12,2,4,NULL),(10,'wow',5,'2025-05-06 21:01:02.717188',13,1,4,NULL),(11,NULL,4,'2025-05-06 21:01:10.831514',11,3,4,NULL),(12,'Incre%ble',5,'2025-05-06 21:10:21.000000',1,5,2,NULL);
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

-- Dump completed on 2025-05-06 21:12:28