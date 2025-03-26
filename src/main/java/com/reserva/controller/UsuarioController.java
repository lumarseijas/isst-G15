package com.reserva.controller;

import com.reserva.dto.AuthRequest;
import com.reserva.dto.AuthResponse;
import com.reserva.model.Usuario;
import com.reserva.security.JwtUtil;
import com.reserva.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios") 
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtUtil jwtUtil;

    //REGISTRO
    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody Usuario nuevoUsuario) {
        Optional<Usuario> existente = usuarioService.obtenerPorEmail(nuevoUsuario.getEmail());

        if (existente.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Ya existe un usuario con ese email");
        }

        Usuario registrado = usuarioService.guardarUsuario(nuevoUsuario);
        return ResponseEntity.ok(registrado);
    }


    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        Optional<Usuario> usuarioOpt = usuarioService.obtenerPorEmail(authRequest.getEmail());

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            if (usuario.getPassword().equals(authRequest.getPassword())) {
                String token = jwtUtil.generateToken(usuario.getEmail());
                return ResponseEntity.ok(new AuthResponse(token, usuario));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
    }

    // (otros métodos: obtener, crear usuario, etc.)
    @GetMapping
    public List<Usuario> obtenerTodos() {
        return usuarioService.obtenerTodos();
    }

}
