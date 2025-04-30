package com.reserva;

import com.reserva.controller.DisponibilidadController;
import com.reserva.model.Reserva;
import com.reserva.model.Servicio;
import com.reserva.model.Trabajador;
import com.reserva.service.*;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DisponibilidadController.class)
@AutoConfigureMockMvc(addFilters = false)
public class TestDisponibilidadController {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ReservaService reservaService;

    @MockBean
    private ServicioService servicioService;

    @MockBean
    private TrabajadorService trabajadorService;

    @MockBean
    private DiaNoDisponibleService diaNoDisponibleService;

    @Test
    public void testSinHorasDisponiblesPorDiaLibre() throws Exception {
        // Servicio
        Servicio servicio = new Servicio();
        servicio.setId(1L);
        servicio.setDuracion(30);
        Mockito.when(servicioService.findById(1L)).thenReturn(servicio);

        // Trabajador
        Trabajador trabajador = new Trabajador();
        trabajador.setId(1L);
        Mockito.when(trabajadorService.findAll()).thenReturn(List.of(trabajador));

        // Día libre
        Mockito.when(diaNoDisponibleService.existeDiaLibre(1L, LocalDate.of(2025, 5, 1))).thenReturn(true);

        // No hay reservas
        Mockito.when(reservaService.findByFecha(LocalDate.of(2025, 5, 1))).thenReturn(Collections.emptyList());

        // Perform
        mockMvc.perform(get("/api/disponibilidad")
                        .param("fecha", "2025-05-01")
                        .param("servicioId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }
    @Test
    public void testHorasDisponiblesConTrabajadorLibre() throws Exception {
        // Servicio
        Servicio servicio = new Servicio();
        servicio.setId(1L);
        servicio.setDuracion(30);
        Mockito.when(servicioService.findById(1L)).thenReturn(servicio);

        // Trabajador disponible (no tiene día libre)
        Trabajador trabajador = new Trabajador();
        trabajador.setId(1L);
        Mockito.when(trabajadorService.findAll()).thenReturn(List.of(trabajador));
        Mockito.when(diaNoDisponibleService.existeDiaLibre(1L, LocalDate.of(2025, 5, 2))).thenReturn(false);

        // No hay reservas ese día
        Mockito.when(reservaService.findByFecha(LocalDate.of(2025, 5, 2))).thenReturn(Collections.emptyList());

        // Perform
        mockMvc.perform(get("/api/disponibilidad")
                        .param("fecha", "2025-05-02")
                        .param("servicioId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(49)); // de 9:00 a 21:00 cada 15 minutos → 49 intervalos
    }

}
