package com.reserva;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import java.util.Optional;

import com.reserva.model.Servicio;
import com.reserva.repository.ServicioRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class TestServicioRepository {

    @Autowired
    private ServicioRepository servicioRepository;

    @Test
    public void testCreateReadDeleteServicio() {
        Servicio servicio = new Servicio();
        servicio.setNombreServicio("Corte de pelo JUnit");
        servicio.setPrecio(new BigDecimal("20.00"));
        servicio.setDuracion(30);
        servicio.setImagen("https://ejemplo.com/corte.jpg");

        Servicio saved = servicioRepository.save(servicio);

        Optional<Servicio> found = servicioRepository.findById(saved.getId());
        assertTrue(found.isPresent());
        assertEquals("Corte de pelo JUnit", found.get().getNombreServicio());

        servicioRepository.delete(saved);
        assertFalse(servicioRepository.findById(saved.getId()).isPresent());
    }
}

