CREATE DATABASE IF NOT EXISTS reserva_belleza;
USE reserva_belleza;

-- Tabla de Usuarios (Administrador y Cliente Online)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(20), -- Solo para clientes online
    tipo ENUM('administrador', 'cliente_online') NOT NULL
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
    num_tlfno VARCHAR(20), -- Para clientes presenciales 
    trabajador_id INT NOT NULL, -- Referencia a la tabla trabajadores
    servicio_id INT NOT NULL, -- Referencia a la tabla servicios
    fecha_y_hora DATETIME NOT NULL,
    FOREIGN KEY (cliente_online) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (trabajador_id) REFERENCES trabajadores(id) ON DELETE CASCADE,
    FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON DELETE CASCADE,
    CHECK (
        (cliente_online IS NOT NULL AND cliente_presencial IS NULL) OR 
        (cliente_online IS NULL AND cliente_presencial IS NOT NULL)
    )
);

COMMIT;