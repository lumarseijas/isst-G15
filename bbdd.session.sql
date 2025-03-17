CREATE DATABASE IF NOT EXISTS reserva_belleza;
USE reserva_belleza;

-- Tabla de Usuarios (Administrador y Cliente Online)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20), -- Solo para clientes online
    tipo ENUM('administrador', 'cliente_online') NOT NULL,
    avatar VARCHAR(255) NOT NULL DEFAULT 'C:\Users\lucia\isst-G15\reserva-belleza-web\src\assets\defecto.png'
    );

-- Tabla de Trabajadores (Lista gestionada por el administrador)
CREATE TABLE trabajadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(20)
    );

-- Tabla de Servicios
CREATE TABLE servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_servicio VARCHAR(255) UNIQUE NOT NULL,
    duracion INT NOT NULL, -- En minutos
    precio DECIMAL(10,2) NOT NULL -- En euros
    );

-- Tabla de Reservas
CREATE TABLE reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_online INT, -- Si es cliente online, referenciado a usuarios
    cliente_presencial VARCHAR(255), -- Si es cliente presencial, se guarda un nombre manualmente
    num_tlfno VARCHAR(20), -- Para clientes presenciales (podria quitarse pero no molesta)
    servicio_id INT NOT NULL, -- Referencia a la tabla servicios
    fecha_y_hora DATETIME NOT NULL,
    FOREIGN KEY (cliente_online) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON DELETE CASCADE
    -- lo del check no le convencia y lo he tenido que quitar para poder crear la tabla
    -- lo tendremos que poner en el backend 
);

