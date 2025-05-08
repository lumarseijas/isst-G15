package com.reserva.controller;

import com.reserva.dto.AuthRequest;
import com.reserva.dto.AuthResponse;
import com.reserva.model.Usuario;
import com.reserva.security.JwtUtil;
import com.reserva.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.reserva.service.EmailService;
import com.reserva.repository.UsuarioRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.Map;


@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EmailService emailService;


    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerUsuarioPorId(@PathVariable Long id) {
        Optional<Usuario> usuarioOpt = usuarioService.obtenerPorId(id);

        if (usuarioOpt.isPresent()) {
            return ResponseEntity.ok(usuarioOpt.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario datosActualizados) {
        Optional<Usuario> usuarioOpt = usuarioService.obtenerPorId(id);

        if (usuarioOpt.isPresent()) {
            Usuario usuarioExistente = usuarioOpt.get();

            // Solo actualizamos los campos permitidos
            usuarioExistente.setNombre(datosActualizados.getNombre());
            usuarioExistente.setTelefono(datosActualizados.getTelefono());
            usuarioExistente.setAvatar(datosActualizados.getAvatar());

            Usuario actualizado = usuarioService.guardarUsuario(usuarioExistente);
            return ResponseEntity.ok(actualizado);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }
    }

    // REGISTRO
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
            if (passwordEncoder.matches(authRequest.getPassword(), usuario.getPassword())) {
                String token = jwtUtil.generateToken(usuario.getEmail());
                return ResponseEntity.ok(new AuthResponse(token, usuario));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
    }
    // UsuarioController.java

    @PostMapping("/recuperar")
    public ResponseEntity<?> recuperarPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
    
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No existe una cuenta con ese email.");
        }
    
        Usuario usuario = usuarioOpt.get();
        String nuevaPass = UUID.randomUUID().toString().substring(0, 8); // 8 caracteres aleatorios
        usuario.setPassword(passwordEncoder.encode(nuevaPass)); // ¡IMPORTANTE! Guarda la contraseña hasheada
        usuarioRepository.save(usuario);
    
        emailService.enviarCorreo(
            usuario.getEmail(),
            "Recuperación de contraseña",
            "Tu nueva contraseña es: " + nuevaPass
        );
    
        return ResponseEntity.ok("Se ha enviado una nueva contraseña a tu correo.");
    }
    @PostMapping("/cambiar-password")
    public ResponseEntity<?> cambiarPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String actual = payload.get("actual");
        String nueva = payload.get("nueva");
    
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado.");
        }
    
        Usuario usuario = usuarioOpt.get();
    
        if (!passwordEncoder.matches(actual, usuario.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña actual incorrecta.");
        }
    
        usuario.setPassword(passwordEncoder.encode(nueva));
        usuarioRepository.save(usuario);
    
        return ResponseEntity.ok("Contraseña actualizada correctamente.");
    }
    

    // (otros metodos: obtener, crear usuario, etc.)
    @GetMapping
    public List<Usuario> obtenerTodos() {
        return usuarioService.obtenerTodos();
    }

}
