import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';


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
    console.error("❌ Error conectando a MySQL:", err);
  } else {
    console.log("✅ Conectado a MySQL correctamente.");
  }
});

// Ruta para obtener los servicios
app.get('/api/servicios', (req, res) => {
  db.query('SELECT * FROM servicios', (err, result) => {
    if (err) {
      console.error("❌ Error en la consulta:", err);
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
        console.error("❌ Error al obtener los servicios:", err);
        res.status(500).json({ error: "Error al obtener los servicios" });
      } else {
        res.json(result);
      }
    });
  });

// Ruta para registrar una reserva
app.post('/api/reservas', (req, res) => {
    const { nombre_cliente, num_tlfno, servicio_id, fecha_y_hora } = req.body;
  
    const sql = `
      INSERT INTO reservas (cliente_presencial, num_tlfno, servicio_id, fecha_y_hora)
      VALUES (?, ?, ?, ?)
    `;
  
    db.query(sql, [nombre_cliente, num_tlfno || null, servicio_id, fecha_y_hora], (err, result) => {
      if (err) {
        console.error("❌ Error al registrar la reserva:", err);
        res.status(500).json({ error: "Error al registrar la reserva" });
      } else {
        res.json({ mensaje: "Reserva guardada correctamente" });
      }
    });
  });


// Ruta para registrar usuarios
app.post('/api/registro', async (req, res) => {
    const { nombre, email, telefono, password } = req.body;
  
    // Encriptar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const sql = 'INSERT INTO usuarios (nombre, email, telefono, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [nombre, email, telefono, hashedPassword], (err, result) => {
      if (err) {
        console.error("❌ Error al registrar usuario:", err);
        res.status(500).json({ error: "Error al registrar usuario" });
      } else {
        res.json({ mensaje: "Usuario registrado correctamente" });
      }
    });
  });

// Iniciar el servidor
app.listen(5000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:5000");
});
