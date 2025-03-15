import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Encabezado from "./components/Encabezado";
import PiePagina from "./components/PiePagina";
import Inicio from "./pages/Inicio";
import Servicios from "./pages/Servicios";
import Reservas from "./pages/Reservas";
import Contacto from "./pages/Contacto";
import Admin from "./pages/Admin";

function App() {
  return (
    <Router>
      <Encabezado />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <PiePagina />
    </Router>
  );
}

export default App;
