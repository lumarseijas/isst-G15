package com.reserva;

import com.reserva.controller.ValoracionController;
import com.reserva.model.Reserva;
import com.reserva.model.Valoracion;
import com.reserva.repository.ReservaRepository;
import com.reserva.repository.UsuarioRepository;
import com.reserva.repository.ValoracionRepository;
import com.reserva.service.ValoracionService;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;


@WebMvcTest(ValoracionController.class)
@AutoConfigureMockMvc(addFilters = false) // 👈 Desactiva seguridad
public class TestValoracionController {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ValoracionService valoracionService;

    @MockitoBean
    private UsuarioRepository usuarioRepository;

    @MockitoBean
    private ReservaRepository reservaRepository;

    @MockitoBean
    private ValoracionRepository valoracionRepository;

    @Test
    public void testObtenerValoracionesPorServicio() throws Exception {
        Valoracion v1 = new Valoracion();
        v1.setId(1L);
        v1.setComentario("Muy bien");
        v1.setEstrellas(5);

        Valoracion v2 = new Valoracion();
        v2.setId(2L);
        v2.setComentario("Mejorable");
        v2.setEstrellas(3);

        List<Valoracion> mockValoraciones = Arrays.asList(v1, v2);
        Mockito.when(valoracionService.obtenerValoracionesPorServicio(10L)).thenReturn(mockValoraciones);

        mockMvc.perform(get("/api/valoraciones/servicio/10")
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(2))
            .andExpect(jsonPath("$[0].comentario").value("Muy bien"))
            .andExpect(jsonPath("$[1].estrellas").value(3));
    }

    @Test
public void testCrearValoracion() throws Exception {
    Valoracion valoracion = new Valoracion();
    valoracion.setId(1L);
    valoracion.setComentario("Muy buena experiencia");
    valoracion.setEstrellas(5);

    // Simular que el servicio devuelve la valoración creada
    Mockito.when(valoracionService.guardarValoracion(Mockito.any(Valoracion.class)))
           .thenReturn(valoracion);

    // JSON de entrada simulado (no incluye id ni fecha, el backend los asigna)
    String jsonInput = """
        {
            "comentario": "Muy buena experiencia",
            "estrellas": 5
        }
    """;

    mockMvc.perform(post("/api/valoraciones")
            .contentType(MediaType.APPLICATION_JSON)
            .content(jsonInput))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.comentario").value("Muy buena experiencia"))
        .andExpect(jsonPath("$.estrellas").value(5));
}
@Test
public void testActualizarRespuestaAdmin() throws Exception {
    Valoracion existente = new Valoracion();
    existente.setId(1L);
    existente.setComentario("Servicio correcto");
    existente.setEstrellas(4);
    existente.setRespuestaAdmin(null);

    Valoracion actualizada = new Valoracion();
    actualizada.setId(1L);
    actualizada.setComentario("Servicio correcto");
    actualizada.setEstrellas(4);
    actualizada.setRespuestaAdmin("Gracias por tu opinión");

    // Simular repositorio
    Mockito.when(valoracionRepository.findById(1L)).thenReturn(Optional.of(existente));
    Mockito.when(valoracionRepository.save(Mockito.any(Valoracion.class))).thenReturn(actualizada);

    String jsonRequest = """
        {
            "respuestaAdmin": "Gracias por tu opinión"
        }
    """;

    mockMvc.perform(put("/api/valoraciones/1")
            .contentType(MediaType.APPLICATION_JSON)
            .content(jsonRequest))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.respuestaAdmin").value("Gracias por tu opinión"));
}
@Test
public void testObtenerValoracionPorReserva() throws Exception {
    Reserva reserva = new Reserva();
    reserva.setId(1L);

    Valoracion valoracion = new Valoracion();
    valoracion.setId(100L);
    valoracion.setComentario("Muy bien todo");
    valoracion.setEstrellas(5);

    Mockito.when(reservaRepository.findById(1L)).thenReturn(Optional.of(reserva));
    Mockito.when(valoracionService.obtenerValoracionPorReserva(reserva)).thenReturn(Optional.of(valoracion));

    mockMvc.perform(get("/api/valoraciones/reserva/1")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.comentario").value("Muy bien todo"))
        .andExpect(jsonPath("$.estrellas").value(5));
}
@Test
public void testEliminarValoracion() throws Exception {
    // No hace falta devolver nada, solo verificar que se llama al servicio correctamente
    Mockito.doNothing().when(valoracionService).eliminarValoracion(1L);

    mockMvc.perform(delete("/api/valoraciones/1"))
        .andExpect(status().isOk());

    // Verificamos que se haya llamado correctamente
    Mockito.verify(valoracionService).eliminarValoracion(1L);
}

}

