package com.reserva;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.reserva.controller.DiaNoDisponibleController.DiaNoDisponibleDTO;
import com.reserva.controller.DiaNoDisponibleController;
import com.reserva.model.DiaNoDisponible;
import com.reserva.model.Trabajador;
import com.reserva.repository.DiaNoDisponibleRepository;
import com.reserva.repository.TrabajadorRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DiaNoDisponibleController.class)
@AutoConfigureMockMvc(addFilters = false)
public class TestDiaNoDisponibleController {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DiaNoDisponibleRepository diaRepo;

    @MockBean
    private TrabajadorRepository trabajadorRepo;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testObtenerDiasPorTrabajador() throws Exception {
        DiaNoDisponible dia = new DiaNoDisponible();
        dia.setId(1L);
        dia.setFecha(LocalDate.of(2025, 5, 15));
        dia.setTrabajador(new Trabajador());

        Mockito.when(diaRepo.findByTrabajadorId(1L)).thenReturn(List.of(dia));

        mockMvc.perform(get("/api/dias-no-disponibles/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].fecha").value("2025-05-15"));
    }

    @Test
    public void testCrearDiaNoDisponible() throws Exception {
        Long trabajadorId = 1L;
        LocalDate fecha = LocalDate.of(2025, 5, 20);

        Trabajador trabajador = new Trabajador();
        trabajador.setId(trabajadorId);
        trabajador.setNombre("Pedro");

        DiaNoDisponibleDTO dto = new DiaNoDisponibleDTO(trabajadorId, fecha);

        Mockito.when(diaRepo.existsByTrabajadorIdAndFecha(trabajadorId, fecha)).thenReturn(false);
        Mockito.when(trabajadorRepo.findById(trabajadorId)).thenReturn(Optional.of(trabajador));

        mockMvc.perform(post("/api/dias-no-disponibles")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(content().string("Día no disponible registrado."));
    }

    @Test
    public void testCrearDiaRepetido() throws Exception {
        Long trabajadorId = 1L;
        LocalDate fecha = LocalDate.of(2025, 5, 20);
        DiaNoDisponibleDTO dto = new DiaNoDisponibleDTO(trabajadorId, fecha);

        Mockito.when(diaRepo.existsByTrabajadorIdAndFecha(trabajadorId, fecha)).thenReturn(true);

        mockMvc.perform(post("/api/dias-no-disponibles")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Ya existe ese día libre para este trabajador."));
    }
}
