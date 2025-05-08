package com.reserva;

import com.reserva.controller.ReservaController;
import com.reserva.model.*;
import com.reserva.service.*;
import com.reserva.repository.ReservaRepository;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@WebMvcTest(ReservaController.class)
@AutoConfigureMockMvc(addFilters = false)
public class TestReservaController {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ReservaService reservaService;

    @MockitoBean
    private ServicioService servicioService;

    @MockitoBean
    private TrabajadorService trabajadorService;

    @MockitoBean
    private UsuarioService usuarioService;

    @MockitoBean
    private ReservaRepository reservaRepository;

    @MockitoBean
    private DiaNoDisponibleService diaNoDisponibleService;

    @MockitoBean
    private EmailService emailService;

    @Test
    public void testObtenerTodasLasReservas() throws Exception {
        Reserva reserva1 = new Reserva();
        reserva1.setId(1L);

        Reserva reserva2 = new Reserva();
        reserva2.setId(2L);

        Mockito.when(reservaService.obtenerTodas()).thenReturn(List.of(reserva1, reserva2));

        mockMvc.perform(get("/api/reservas"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    public void testCrearReservaExitosa() throws Exception {
        Servicio servicio = new Servicio();
        servicio.setId(1L);
        servicio.setDuracion(30);
        servicio.setNombreServicio("Corte");

        Usuario cliente = new Usuario();
        cliente.setId(1L);
        cliente.setNombre("Ana");
        cliente.setEmail("ana@test.com");

        Trabajador trabajador = new Trabajador();
        trabajador.setId(1L);
        trabajador.setNombre("Lucía");

        Reserva reserva = new Reserva();
        reserva.setId(1L);
        reserva.setFechaYHora(LocalDateTime.of(2025, 5, 1, 20, 1));
        reserva.setServicio(servicio);
        reserva.setClienteOnline(cliente);
        reserva.setTrabajador(trabajador);

        Mockito.when(servicioService.obtenerPorId(1L)).thenReturn(Optional.of(servicio));
        Mockito.when(usuarioService.obtenerPorId(1L)).thenReturn(Optional.of(cliente));
        Mockito.when(trabajadorService.obtenerTodos()).thenReturn(List.of(trabajador));
        Mockito.when(reservaService.estaTrabajadorOcupadoDurante(Mockito.any(), Mockito.any(), Mockito.anyInt(), Mockito.isNull())).thenReturn(false);
        Mockito.when(diaNoDisponibleService.existeDiaLibre(Mockito.anyLong(), Mockito.any())).thenReturn(false);
        Mockito.when(reservaService.clienteTieneOtraReservaEnEseHorario(Mockito.anyLong(), Mockito.any(), Mockito.anyInt(), Mockito.isNull())).thenReturn(false);
        Mockito.when(reservaService.guardarReserva(Mockito.any())).thenReturn(reserva);

        String reservaJson = """
            {
                "fechaYHora": "2025-05-01T20:01",
                "servicio": { "id": 1 },
                "clienteOnline": { "id": 1 }
            }
        """;

        mockMvc.perform(post("/api/reservas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(reservaJson))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.clienteOnline.nombre").value("Ana"))
            .andExpect(jsonPath("$.servicio.nombreServicio").value("Corte"));
    }

    @Test
    public void testActualizarReserva() throws Exception {
        Servicio servicio = new Servicio();
        servicio.setId(1L);
        servicio.setDuracion(30);
        servicio.setNombreServicio("Corte de pelo");

        Usuario cliente = new Usuario();
        cliente.setId(2L);
        cliente.setNombre("Lucía");
        cliente.setEmail("lucia@example.com");

        Trabajador trabajador = new Trabajador();
        trabajador.setId(1L);
        trabajador.setNombre("Laura");

        Reserva reservaActualizada = new Reserva();
        reservaActualizada.setId(1L);
        reservaActualizada.setFechaYHora(LocalDateTime.of(2025, 5, 1, 15, 0));
        reservaActualizada.setServicio(servicio);
        reservaActualizada.setClienteOnline(cliente);
        reservaActualizada.setTrabajador(trabajador);

        Mockito.when(servicioService.obtenerPorId(1L)).thenReturn(Optional.of(servicio));
        Mockito.when(usuarioService.obtenerPorId(2L)).thenReturn(Optional.of(cliente));
        Mockito.when(trabajadorService.obtenerTodos()).thenReturn(List.of(trabajador));
        Mockito.when(reservaService.estaTrabajadorOcupadoDurante(Mockito.eq(trabajador), Mockito.any(), Mockito.anyInt(), Mockito.eq(1L))).thenReturn(false);
        Mockito.when(diaNoDisponibleService.existeDiaLibre(Mockito.eq(1L), Mockito.any())).thenReturn(false);
        Mockito.when(reservaService.clienteTieneOtraReservaEnEseHorario(2L, reservaActualizada.getFechaYHora(), 30, 1L)).thenReturn(false);
        Mockito.when(reservaService.guardarReserva(Mockito.any())).thenReturn(reservaActualizada);

        mockMvc.perform(put("/api/reservas/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                        "fechaYHora": "2025-05-01T15:00",
                        "servicio": { "id": 1 },
                        "clienteOnline": { "id": 2 }
                    }
                """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1));
    }
    @Test
    public void testEliminarReservaExistente() throws Exception {
        Servicio servicio = new Servicio();
        servicio.setId(1L);
        servicio.setNombreServicio("Peinado");
    
        Usuario cliente = new Usuario();
        cliente.setId(1L);
        cliente.setNombre("Claudia");
        cliente.setEmail("claudia@example.com");
    
        Reserva reserva = new Reserva();
        reserva.setId(1L);
        reserva.setFechaYHora(LocalDateTime.of(2025, 5, 1, 18, 0));
        reserva.setServicio(servicio);
        reserva.setClienteOnline(cliente);
    
        Mockito.when(reservaService.obtenerPorId(1L)).thenReturn(Optional.of(reserva));
    
        mockMvc.perform(delete("/api/reservas/1"))
            .andExpect(status().isOk());
    }
    @Test
public void testEliminarReservaNoExistente() throws Exception {
    Mockito.when(reservaService.obtenerPorId(999L)).thenReturn(Optional.empty());

    mockMvc.perform(delete("/api/reservas/999"))
        .andExpect(status().isNotFound())
        .andExpect(content().string("Reserva no encontrada."));
}

}
