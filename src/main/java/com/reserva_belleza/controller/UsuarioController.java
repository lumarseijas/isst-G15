package com.reserva_belleza.controller;

import com.reserva_belleza.model.Usuario;
import com.reserva_belleza.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/registro")
    public String registrarUsuario(@RequestBody Usuario usuario) {
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuarioRepository.save(usuario);
        return "Usuario registrado correctamente";
    }

    @PostMapping("/login")
    public String loginUsuario(@RequestBody Usuario usuario) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(usuario.getEmail());

        if (usuarioOpt.isPresent() && passwordEncoder.matches(usuario.getPassword(), usuarioOpt.get().getPassword())) {
            return "Inicio de sesión exitoso";
        } else {
            return "Error en credenciales";
     }
  }
}