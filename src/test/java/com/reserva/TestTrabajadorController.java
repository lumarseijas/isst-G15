package com.reserva;

import com.reserva.controller.TrabajadorController;
import com.reserva.model.Trabajador;
import com.reserva.service.TrabajadorService;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

@WebMvcTest(TrabajadorController.class)
@AutoConfigureMockMvc(addFilters = false)
public class TestTrabajadorController {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TrabajadorService trabajadorService;

    @Test
    public void testObtenerTodos() throws Exception {
        Trabajador t1 = new Trabajador();
        t1.setId(1L);
        t1.setNombre("Lucía");

        Trabajador t2 = new Trabajador();
        t2.setId(2L);
        t2.setNombre("Mario");

        Mockito.when(trabajadorService.obtenerTodos()).thenReturn(List.of(t1, t2));

        mockMvc.perform(get("/api/trabajadores"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    public void testObtenerPorIdExistente() throws Exception {
        Trabajador t = new Trabajador();
        t.setId(1L);
        t.setNombre("Lucía");

        Mockito.when(trabajadorService.obtenerPorId(1L)).thenReturn(Optional.of(t));

        mockMvc.perform(get("/api/trabajadores/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Lucía"));
    }

    @Test
    public void testObtenerPorIdNoExistente() throws Exception {
        Mockito.when(trabajadorService.obtenerPorId(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/trabajadores/99"))
                .andExpect(status().isOk())
                .andExpect(content().string(""));
    }

    @Test
    public void testCrearTrabajador() throws Exception {
        Trabajador t = new Trabajador();
        t.setId(1L);
        t.setNombre("Lucía");

        Mockito.when(trabajadorService.guardarTrabajador(Mockito.any())).thenReturn(t);

        mockMvc.perform(post("/api/trabajadores")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                            "nombre": "Lucía"
                        }
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Lucía"));
    }

    @Test
    public void testActualizarTrabajador() throws Exception {
        Trabajador t = new Trabajador();
        t.setId(1L);
        t.setNombre("Lucía actualizada");

        Mockito.when(trabajadorService.guardarTrabajador(Mockito.any())).thenReturn(t);

        mockMvc.perform(put("/api/trabajadores/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                            "nombre": "Lucía actualizada"
                        }
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Lucía actualizada"));
    }
}

