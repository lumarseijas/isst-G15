package com.reserva;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDateTime;

import com.reserva.model.*;
import com.reserva.repository.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class TestValoracionRepository {

    @Autowired
    private ValoracionRepository valoracionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ServicioRepository servicioRepository;

    @Autowired
    private TrabajadorRepository trabajadorRepository;

    @Autowired
    private ReservaRepository reservaRepository;

    @Test
    public void testFindByReserva() {
        // Crear entidades necesarias
        Usuario usuario = new Usuario();
        usuario.setNombre("Cliente Test");
        usuario.setEmail("cliente" + System.currentTimeMillis() + "@test.com");
        usuario.setPassword("1234");
        usuario.setTipo(Usuario.TipoUsuario.CLIENTE_ONLINE);
        usuario = usuarioRepository.save(usuario);

        Servicio servicio = new Servicio();
        servicio.setNombreServicio("Masaje JUnit");
        servicio.setDuracion(60);
        servicio.setPrecio(java.math.BigDecimal.valueOf(50.00));
        servicio.setImagen("masaje.jpg");
        servicio = servicioRepository.save(servicio);

        Trabajador trabajador = new Trabajador();
        trabajador.setNombre("Trabajador Test");
        trabajador.setTelefono("666123456");
        trabajador = trabajadorRepository.save(trabajador);

        Reserva reserva = new Reserva();
        reserva.setClienteOnline(usuario);
        reserva.setServicio(servicio);
        reserva.setTrabajador(trabajador);
        reserva.setFechaYHora(LocalDateTime.now().plusDays(1));
        reserva = reservaRepository.save(reserva);

        Valoracion valoracion = new Valoracion();
        valoracion.setReserva(reserva);
        valoracion.setUsuario(usuario);
        valoracion.setComentario("Excelente atención");
        valoracion.setEstrellas(5);
        valoracion = valoracionRepository.save(valoracion);

        // Recuperar valoración por reserva
        Valoracion encontrada = valoracionRepository.findByReserva(reserva);
        assertNotNull(encontrada);
        assertEquals("Excelente atención", encontrada.getComentario());

        // Limpieza
        valoracionRepository.delete(valoracion);
        reservaRepository.delete(reserva);
        trabajadorRepository.delete(trabajador);
        servicioRepository.delete(servicio);
        usuarioRepository.delete(usuario);
    }
}

