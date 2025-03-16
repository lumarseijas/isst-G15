
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Servicios from "./pages/Servicios";
import Reservas from "./pages/Reservas";
import Contacto from "./pages/Contacto";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthMenu from "./pages/AuthMenu";
import Login from './pages/Login';
import Registro from './pages/Registro';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/auth" element={<AuthMenu />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;