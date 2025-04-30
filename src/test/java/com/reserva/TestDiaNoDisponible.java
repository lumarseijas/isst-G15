package com.reserva;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDate;

import com.reserva.model.DiaNoDisponible;
import com.reserva.model.Trabajador;
import com.reserva.repository.DiaNoDisponibleRepository;
import com.reserva.repository.TrabajadorRepository;
import com.reserva.service.DiaNoDisponibleService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class TestDiaNoDisponible {

    @Autowired
    private DiaNoDisponibleService diaNoDisponibleService;

    @Autowired
    private DiaNoDisponibleRepository diaNoDisponibleRepository;

    @Autowired
    private TrabajadorRepository trabajadorRepository;

    @Test
    public void testExisteDiaLibre() {
        // Crear trabajador
        Trabajador trabajador = new Trabajador();
        trabajador.setNombre("Trabajador Test");
        trabajador.setTelefono("666123456");
        trabajador = trabajadorRepository.save(trabajador);

        Long trabajadorId = trabajador.getId();
        LocalDate fecha = LocalDate.of(2025, 5, 10);

        // Caso 1: no debería haber días libres aún
        assertFalse(diaNoDisponibleService.existeDiaLibre(trabajadorId, fecha));

        // Añadir un día libre
        DiaNoDisponible dia = new DiaNoDisponible();
        dia.setTrabajador(trabajador);
        dia.setFecha(fecha);
        diaNoDisponibleRepository.save(dia);

        // Caso 2: ahora sí debería detectarlo
        assertTrue(diaNoDisponibleService.existeDiaLibre(trabajadorId, fecha));

        // Limpieza
        diaNoDisponibleRepository.delete(dia);
        trabajadorRepository.delete(trabajador);
    }
}

