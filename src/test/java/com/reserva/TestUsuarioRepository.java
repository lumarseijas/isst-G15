package com.reserva;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Optional;

import com.reserva.model.Usuario;
import com.reserva.model.Usuario.TipoUsuario;
import com.reserva.repository.UsuarioRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class TestUsuarioRepository {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Test
    public void testCreateReadDeleteUsuario() {
        Usuario usuario = new Usuario();
        usuario.setNombre("Lucía Test");
        usuario.setEmail("lucia" + System.currentTimeMillis() + "@test.com"); // Evita conflictos de unicidad
        usuario.setPassword("claveSegura123");
        usuario.setTelefono("666777888");
        usuario.setTipo(TipoUsuario.CLIENTE_ONLINE);
        usuario.setAvatar("avatar1");

        Usuario saved = usuarioRepository.save(usuario);

        Optional<Usuario> found = usuarioRepository.findById(saved.getId());
        assertTrue(found.isPresent());
        assertEquals("Lucía Test", found.get().getNombre());

        usuarioRepository.delete(saved);
        assertFalse(usuarioRepository.findById(saved.getId()).isPresent());
    }
}
