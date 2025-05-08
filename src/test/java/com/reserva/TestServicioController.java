package com.reserva;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.reserva.controller.ServicioController;
import com.reserva.model.Servicio;
import com.reserva.service.ServicioService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ServicioController.class)
@AutoConfigureMockMvc(addFilters = false)
public class TestServicioController {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ServicioService servicioService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testObtenerTodosLosServicios() throws Exception {
        Servicio s1 = new Servicio();
        s1.setId(1L);
        s1.setNombreServicio("Corte");

        Servicio s2 = new Servicio();
        s2.setId(2L);
        s2.setNombreServicio("Manicura");

        Mockito.when(servicioService.obtenerTodos()).thenReturn(List.of(s1, s2));

        mockMvc.perform(get("/api/servicios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    public void testObtenerServicioPorId() throws Exception {
        Servicio servicio = new Servicio();
        servicio.setId(1L);
        servicio.setNombreServicio("Corte de pelo");

        Mockito.when(servicioService.obtenerPorId(1L)).thenReturn(Optional.of(servicio));

        mockMvc.perform(get("/api/servicios/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombreServicio").value("Corte de pelo"));
    }

    @Test
    public void testCrearServicio() throws Exception {
        Servicio nuevo = new Servicio();
        nuevo.setId(1L);
        nuevo.setNombreServicio("Peinado");

        Mockito.when(servicioService.guardarServicio(Mockito.any())).thenReturn(nuevo);

        mockMvc.perform(post("/api/servicios")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(nuevo)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombreServicio").value("Peinado"));
    }

    @Test
    public void testActualizarServicio() throws Exception {
        Servicio actualizado = new Servicio();
        actualizado.setId(1L);
        actualizado.setNombreServicio("Depilación");

        Mockito.when(servicioService.guardarServicio(Mockito.any())).thenReturn(actualizado);

        mockMvc.perform(put("/api/servicios/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(actualizado)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombreServicio").value("Depilación"));
    }

    @Test
    public void testEliminarServicio() throws Exception {
        mockMvc.perform(delete("/api/servicios/1"))
                .andExpect(status().isOk());
    }
}
