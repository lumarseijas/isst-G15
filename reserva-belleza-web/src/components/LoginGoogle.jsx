import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import axios from 'axios';

const LoginGoogle = () => {
  const handleLogin = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;

      // Enviamos el ID token al backend
      const res = await axios.get("http://localhost:5000/oauth2/success", {
        headers: {
          Authorization: `Bearer ${idToken}`
        },
        withCredentials: false
      });

      // Guardamos el JWT devuelto
      localStorage.setItem("jwt", res.data.token);
      alert("Inicio de sesión exitoso 🎉");

    } catch (err) {
      console.error("Error en el login con Google", err);
      alert("Error en el login");
    }
  };

  return (
    <div>
      <h3>Inicia sesión con Google</h3>
      <GoogleLogin
        onSuccess={handleLogin}
        onError={() => console.log("Falló el login")}
      />
    </div>
  );
};

export default LoginGoogle;