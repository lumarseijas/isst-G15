package com.reserva;

import com.reserva.controller.DisponibilidadController;
import com.reserva.model.Reserva;
import com.reserva.model.Servicio;
import com.reserva.model.Trabajador;
import com.reserva.service.ReservaService;
import com.reserva.service.ServicioService;
import com.reserva.service.TrabajadorService;
import com.reserva.service.DiaNoDisponibleService;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

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
    public void testHorasDisponibles() throws Exception {
        LocalDate fecha = LocalDate.of(2025, 5, 2);

        Servicio servicio = new Servicio();
        servicio.setId(1L);
        servicio.setDuracion(30);

        Trabajador trabajador = new Trabajador();
        trabajador.setId(1L);
        trabajador.setNombre("Lucía");

        Mockito.when(servicioService.findById(1L)).thenReturn(servicio);
        Mockito.when(trabajadorService.findAll()).thenReturn(List.of(trabajador));
        Mockito.when(diaNoDisponibleService.existeDiaLibre(1L, fecha)).thenReturn(false);
        Mockito.when(reservaService.findByFecha(fecha)).thenReturn(List.of());

        mockMvc.perform(get("/api/disponibilidad")
                .param("fecha", "2025-05-02")
                .param("servicioId", "1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(48)); // 48 intervalos de 15 min entre 9:00 y 21:00
    }
}
