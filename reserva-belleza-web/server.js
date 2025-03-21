import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(express.json());

// Conectar a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Tu usuario de MySQL
  password: 'Peluqueria_G15',  // Tu contraseña de MySQL
  database: 'reserva_belleza'  // Nombre de tu base de datos
});

db.connect(err => {
  if (err) {
    console.error("Error conectando a MySQL:", err);
  } else {
    console.log("Conectado a MySQL correctamente.");
  }
});

// Ruta para obtener los servicios
app.get('/api/servicios', (req, res) => {
  db.query('SELECT * FROM servicios', (err, result) => {
    if (err) {
      console.error("Error en la consulta:", err);
      res.status(500).json({ error: "Error al obtener los servicios" });
    } else {
      res.json(result);
    }
  });
});

// Ruta para obtener todos los servicios disponibles
app.get('/api/servicios', (req, res) => {
    db.query('SELECT id, nombre_servicio FROM servicios', (err, result) => {
      if (err) {
        console.error("Error al obtener los servicios:", err);
        res.status(500).json({ error: "Error al obtener los servicios" });
      } else {
        res.json(result);
      }
    });
  });

  app.post('/api/reservas', (req, res) => {
    const { cliente_online, num_tlfno, servicio_id, fecha_y_hora } = req.body;

    if (!cliente_online) {
        return res.status(400).json({ error: "Falta el ID del cliente online." });
    }

    const sql = `
      INSERT INTO reservas (cliente_online, num_tlfno, servicio_id, fecha_y_hora)
      VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [cliente_online, num_tlfno || null, servicio_id, fecha_y_hora], (err, result) => {
      if (err) {
        console.error("Error al registrar la reserva:", err);
        res.status(500).json({ error: "Error al registrar la reserva" });
      } else {
        res.json({ mensaje: "Reserva guardada correctamente", reserva_id: result.insertId });
      }
    });
});


// Ruta para registrar usuarios
app.post('/api/registro', async (req, res) => {
    const { nombre, email, telefono, password, avatar } = req.body;
  
    // Encriptar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const sql = 'INSERT INTO usuarios (nombre, email, telefono, password, avatar) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nombre, email, telefono || null, hashedPassword, avatar], (err, result) => {      if (err) {
        console.error("Error al registrar usuario:", err);
        res.status(500).json({ error: "Error al registrar usuario" });
      } else {
        res.json({ mensaje: "Usuario registrado correctamente" });
      }
    });
  });

// Ruta para autenticar usuarios
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
  
    const sql = 'SELECT * FROM usuarios WHERE email = ?';
    db.query(sql, [email], async (err, result) => {
      if (err) {
        console.error("Error al buscar usuario:", err);
        return res.status(500).json({ error: "Error en el servidor" });
      }
  
      if (result.length === 0) {
        return res.status(401).json({ error: "Usuario no encontrado" });
      }
  
      const usuario = result[0];
      const match = await bcrypt.compare(password, usuario.password);
  
      if (!match) {
        return res.status(401).json({ error: "Contraseña incorrecta" });
      }
  
      // Generar un token JWT para autenticar la sesión
      const token = jwt.sign({ id: usuario.id, email: usuario.email }, 'secreto_jwt', { expiresIn: '1h' });
  
      res.json({ mensaje: "Inicio de sesión exitoso", usuario, token });
    });
  });
 
  app.post('/api/registro', async (req, res) => {
    const { nombre, email, telefono, password } = req.body;
  
    // Encriptar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const sql = 'INSERT INTO usuarios (nombre, email, telefono, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [nombre, email, telefono || null, hashedPassword], (err, result) => {
      if (err) {
        console.error("Error al registrar usuario:", err);
        return res.status(500).json({ error: "Error al registrar usuario" });
      }
      res.json({ mensaje: "Usuario registrado correctamente" });
    });
  });
  
  app.get('/api/trabajadores', (req, res) => {
    const sql = 'SELECT id, nombre, telefono FROM trabajadores';
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error al obtener trabajadores:', err);
        return res.status(500).json({ error: 'Error al obtener trabajadores' });
      }
      res.json(result);
    });
  });
  
//ruta obtener datos usuario
  app.get('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT nombre, email, telefono, avatar FROM usuarios WHERE id = ?';
  
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error('Error al obtener el usuario:', err);
        return res.status(500).json({ error: 'Error al obtener el usuario' });
      }
      if (result.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(result[0]);
    });
  });
  
//ruta para actualizar perfil usuario
app.put('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, telefono, avatar } = req.body;
  
    const sql = 'UPDATE usuarios SET nombre = ?, telefono = ?, avatar = ? WHERE id = ?';
    db.query(sql, [nombre, telefono, avatar, id], (err, result) => {
      if (err) {
        console.error('Error al actualizar usuario:', err);
        return res.status(500).json({ error: 'Error al actualizar usuario' });
      }
      res.json({ mensaje: 'Perfil actualizado correctamente' });
    });
  });
  

// Iniciar el servidor
app.listen(5000, () => {
  console.log("Servidor corriendo en http://localhost:5000");
});
//