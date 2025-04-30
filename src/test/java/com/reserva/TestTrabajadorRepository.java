package com.reserva;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Optional;

import com.reserva.model.Trabajador;
import com.reserva.repository.TrabajadorRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class TestTrabajadorRepository {

    @Autowired
    private TrabajadorRepository trabajadorRepository;

    @Test
    public void testCreateReadDeleteTrabajador() {
        Trabajador trabajador = new Trabajador();
        trabajador.setNombre("Juan Test");
        trabajador.setTelefono("600123456");

        Trabajador saved = trabajadorRepository.save(trabajador);

        Optional<Trabajador> found = trabajadorRepository.findById(saved.getId());
        assertTrue(found.isPresent());
        assertEquals("Juan Test", found.get().getNombre());

        trabajadorRepository.delete(saved);
        assertFalse(trabajadorRepository.findById(saved.getId()).isPresent());
    }
}
