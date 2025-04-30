package com.reserva;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDateTime;
import java.util.Optional;

import com.reserva.model.*;
import com.reserva.repository.ReservaRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class TestReservaRepository {

    @Autowired
    private ReservaRepository reservaRepository;

    @Test
    public void testCreateReadDeleteReserva() {
        // Crear reserva
        Reserva reserva = new Reserva();
        reserva.setFechaYHora(LocalDateTime.now().plusDays(1));

        Usuario cliente = new Usuario();
        cliente.setId(1L); // debe existir en la base de datos
        reserva.setClienteOnline(cliente);

        Trabajador trabajador = new Trabajador();
        trabajador.setId(1L); // debe existir en la base de datos
        reserva.setTrabajador(trabajador);

        Servicio servicio = new Servicio();
        servicio.setId(1L); // debe existir en la base de datos
        reserva.setServicio(servicio);

        reserva.setClientePresencial("Test Presencial");
        reserva.setNumTlfno("123456789");

        // Guardar en la BBDD
        Reserva saved = reservaRepository.save(reserva);

        // Comprobar que se guardó correctamente
        Optional<Reserva> found = reservaRepository.findById(saved.getId());
        assertTrue(found.isPresent());
        assertEquals("123456789", found.get().getNumTlfno());

        // Borrar la reserva y comprobar que ya no está
        reservaRepository.delete(saved);
        assertFalse(reservaRepository.findById(saved.getId()).isPresent());
    }
}
