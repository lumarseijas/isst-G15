import { Routes, Route, Navigate } from "react-router-dom";
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
import Perfil from './pages/Perfil';
import { useState, useEffect } from 'react';
import Citas from './pages/Citas';
import NuevoTrabajador from './pages/NuevoTrabajador';
import NuevoServicio from "./pages/NuevoServicio";
import { GoogleOAuthProvider } from '@react-oauth/google';



function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuario'));
    if (usuarioGuardado) {
      setUsuario(usuarioGuardado); // Recupera el usuario si está en localStorage
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId="595824223955-b2hpap1m2vhqs4d7od9sbtt0ab1pam7d.apps.googleusercontent.com">
    <Navbar usuario={usuario} setUsuario={setUsuario} />
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/servicios" element={<Servicios />} />
    <Route path="/reservas" element={<Reservas />} />
    <Route path="/contacto" element={<Contacto />} />
    <Route path="/admin" element={usuario?.tipo === "ADMINISTRADOR" ? ( <Admin />):( <Navigate to="/" replace />)} />
    <Route path="/login" element={<Login setUsuario={setUsuario} />} />
    <Route path="/registro" element={<Registro />} />
    <Route path="/perfil" element={<Perfil />} />
    <Route path="/auth" element={<AuthMenu />} />
    <Route path="/citas" element={<Citas />} />
    <Route path="/trabajadores/nuevo" element={<NuevoTrabajador />} />
    <Route path="/servicios/nuevo" element={<NuevoServicio />} />
    </Routes>
    <Footer />
    </GoogleOAuthProvider>
      );
}

export default App;