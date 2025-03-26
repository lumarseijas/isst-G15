CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(255),
    tipo ENUM('ADMINISTRADOR', 'CLIENTE_ONLINE') NOT NULL DEFAULT 'CLIENTE_ONLINE',
    avatar VARCHAR(255)
);
-- Tabla de Trabajadores (Lista gestionada por el administrador)
CREATE TABLE trabajadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(20)
    );

CREATE TABLE servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_servicio VARCHAR(255) UNIQUE NOT NULL,
    duracion INT NOT NULL, -- En minutos
    precio DECIMAL(10,2) NOT NULL, -- En euros
    imagen VARCHAR(255)
    );

CREATE TABLE reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_online BIGINT, -- Ahora coincide con el tipo de usuarios.id
    cliente_presencial VARCHAR(255), -- Si es cliente presencial, se guarda un nombre manualmente
    num_tlfno VARCHAR(20), -- Para clientes presenciales (opcional)
    servicio_id INT NOT NULL, -- Referencia a la tabla servicios
    fecha_y_hora DATETIME NOT NULL,
    FOREIGN KEY (cliente_online) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON DELETE CASCADE
);
