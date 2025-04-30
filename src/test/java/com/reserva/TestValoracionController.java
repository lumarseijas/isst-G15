package com.reserva;

import com.reserva.controller.ValoracionController;
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
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

@WebMvcTest(ValoracionController.class)
@AutoConfigureMockMvc(addFilters = false) // 👈 Desactiva seguridad
public class TestValoracionController {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ValoracionService valoracionService;

    @MockBean
    private UsuarioRepository usuarioRepository;

    @MockBean
    private ReservaRepository reservaRepository;

    @MockBean
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
}

