package com.reserva;

import com.reserva.controller.UsuarioController;
import com.reserva.model.Usuario;
import com.reserva.security.JwtUtil;
import com.reserva.service.UsuarioService;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

@WebMvcTest(UsuarioController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(TestUsuarioController.SecurityTestConfig.class) // Importamos config de seguridad de test
public class TestUsuarioController {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UsuarioService usuarioService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @TestConfiguration
    static class SecurityTestConfig {
        @Bean
        public PasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
        }
    }

    @Test
    public void testObtenerUsuarioPorId() throws Exception {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Lucía");
        usuario.setEmail("lucia@test.com");
        usuario.setPassword("1234");
        usuario.setTelefono("600000000");

        Mockito.when(usuarioService.obtenerPorId(1L)).thenReturn(Optional.of(usuario));

        mockMvc.perform(get("/api/usuarios/1")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Lucía"))
                .andExpect(jsonPath("$.email").value("lucia@test.com"));
    }

    @Test
    public void testUsuarioNoEncontrado() throws Exception {
        Mockito.when(usuarioService.obtenerPorId(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/usuarios/999"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Usuario no encontrado"));
    }
    @Test
    public void testRegistroNuevoUsuario() throws Exception {
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setEmail("nuevo@test.com");
        nuevoUsuario.setPassword("1234");
        nuevoUsuario.setNombre("Nuevo");
        nuevoUsuario.setTelefono("600000000");
    
        // No existe aún
        Mockito.when(usuarioService.obtenerPorEmail("nuevo@test.com")).thenReturn(Optional.empty());
        Mockito.when(usuarioService.guardarUsuario(Mockito.any(Usuario.class))).thenReturn(nuevoUsuario);
    
        mockMvc.perform(post("/api/usuarios/registro")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "email": "nuevo@test.com",
                        "password": "1234",
                        "nombre": "Nuevo",
                        "telefono": "600000000"
                    }
                """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value("nuevo@test.com"));
    }
    
    @Test
    public void testRegistroConEmailExistente() throws Exception {
        Usuario existente = new Usuario();
        existente.setEmail("existente@test.com");
    
        Mockito.when(usuarioService.obtenerPorEmail("existente@test.com")).thenReturn(Optional.of(existente));
    
        mockMvc.perform(post("/api/usuarios/registro")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "email": "existente@test.com",
                        "password": "1234"
                    }
                """))
            .andExpect(status().isConflict())
            .andExpect(content().string("Ya existe un usuario con ese email"));
    }
    
    @Test
    public void testLoginCorrecto() throws Exception {
        Usuario usuario = new Usuario();
        usuario.setEmail("login@test.com");
        usuario.setPassword("hashedpass");
    
        Mockito.when(usuarioService.obtenerPorEmail("login@test.com")).thenReturn(Optional.of(usuario));
        Mockito.when(passwordEncoder.matches("1234", "hashedpass")).thenReturn(true);
        Mockito.when(jwtUtil.generateToken("login@test.com")).thenReturn("fake-jwt-token");
    
        mockMvc.perform(post("/api/usuarios/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "email": "login@test.com",
                        "password": "1234"
                    }
                """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value("fake-jwt-token"))
            .andExpect(jsonPath("$.usuario.email").value("login@test.com"));
    }
    
    @Test
    public void testLoginCredencialesInvalidas() throws Exception {
        Mockito.when(usuarioService.obtenerPorEmail("invalido@test.com")).thenReturn(Optional.empty());
    
        mockMvc.perform(post("/api/usuarios/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "email": "invalido@test.com",
                        "password": "wrong"
                    }
                """))
            .andExpect(status().isUnauthorized())
            .andExpect(content().string("Credenciales inválidas"));
    }
    

}

