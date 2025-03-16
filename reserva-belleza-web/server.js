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

// Iniciar el servidor
app.listen(5000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:5000");
});
