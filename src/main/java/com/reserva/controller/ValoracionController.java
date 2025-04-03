package com.reserva.controller;

import com.reserva.model.Reserva;
import com.reserva.model.Usuario;
import com.reserva.model.Valoracion;
import com.reserva.repository.ReservaRepository;
import com.reserva.repository.UsuarioRepository;
import com.reserva.repository.ValoracionRepository;
import com.reserva.service.ValoracionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/valoraciones")
@CrossOrigin(origins = "*") 
public class ValoracionController {

    @Autowired
    private ValoracionService valoracionService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private ValoracionRepository valoracionRepository;

    // Guardar una nueva valoración
    @PostMapping
    public Valoracion crearValoracion(@RequestBody Valoracion valoracion) {
        valoracion.setFecha(LocalDateTime.now());
        return valoracionService.guardarValoracion(valoracion);
    }
    @PutMapping("/{id}")
    public Valoracion actualizarValoracion(@PathVariable Long id, @RequestBody Valoracion valoracion) {
        Valoracion existente = valoracionRepository.findById(id).orElseThrow();
        existente.setRespuestaAdmin(valoracion.getRespuestaAdmin());
        return valoracionRepository.save(existente);
    }

    // Obtener valoraciones de un usuario
    @GetMapping("/usuario/{usuarioId}")
    public List<Valoracion> obtenerPorUsuario(@PathVariable Long usuarioId) {
        Optional<Usuario> usuario = usuarioRepository.findById(usuarioId);
        return usuario.map(valoracionService::obtenerValoracionesDeUsuario).orElse(null);
    }

    // Obtener valoración por reserva
    @GetMapping("/reserva/{reservaId}")
    public Valoracion obtenerPorReserva(@PathVariable Long reservaId) {
        Optional<Reserva> reserva = reservaRepository.findById(reservaId);
        return reserva.map(r -> valoracionService.obtenerValoracionPorReserva(r).orElse(null)).orElse(null);
    }

    // Obtener valoraciones por servicio (para mostrar nota media, etc.)
    @GetMapping("/servicio/{servicioId}")
    public List<Valoracion> obtenerPorServicio(@PathVariable Long servicioId) {
        return valoracionService.obtenerValoracionesPorServicio(servicioId);
    }
    // Obtener valoraciones por trabajador (para mostrar nota media)
    @GetMapping("/media/trabajador/{trabajadorId}")
    public Double obtenerMediaPorTrabajador(@PathVariable Long trabajadorId) {
        return valoracionService.obtenerMediaValoracionPorTrabajador(trabajadorId);
    }


    // Eliminar una valoración (opcional)
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        valoracionService.eliminarValoracion(id);
    }

}
