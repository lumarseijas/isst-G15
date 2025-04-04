package com.reserva.controller;

import com.reserva.model.Reserva;
import com.reserva.model.Servicio;
import com.reserva.model.Trabajador;
import com.reserva.model.Usuario;
import com.reserva.service.ReservaService;
import com.reserva.service.ServicioService;
import com.reserva.service.TrabajadorService;
import com.reserva.service.UsuarioService;
import com.reserva.repository.ReservaRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "*")
public class ReservaController {

    private final TrabajadorService trabajadorService;
    private final ReservaService reservaService;
    private final ServicioService servicioService;
    private final UsuarioService usuarioService;
    private final ReservaRepository reservaRepository;

    public ReservaController(ReservaService reservaService, TrabajadorService trabajadorService,
                             ServicioService servicioService, UsuarioService usuarioService, ReservaRepository reservaRepository) {
        this.reservaService = reservaService;
        this.trabajadorService = trabajadorService;
        this.servicioService = servicioService;
        this.usuarioService = usuarioService;
        this.reservaRepository = reservaRepository;
    }

    @GetMapping
    public List<Reserva> obtenerTodas() {
        return reservaService.obtenerTodas();
    }

    @GetMapping("/{id}")
    public Optional<Reserva> obtenerPorId(@PathVariable Long id) {
        return reservaService.obtenerPorId(id);
    }

    @PostMapping
    public ResponseEntity<?> crearReserva(@RequestBody Reserva reserva) {
        Long servicioId = reserva.getServicio().getId();
        Optional<Servicio> servicioOpt = servicioService.obtenerPorId(servicioId);
        if (servicioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Servicio no encontrado.");
        }

        Servicio servicio = servicioOpt.get();
        reserva.setServicio(servicio);
        LocalDateTime inicio = reserva.getFechaYHora();
        int duracion = servicio.getDuracion();

        // Validar cliente
        if (reserva.getClienteOnline() != null) {
            Long clienteId = reserva.getClienteOnline().getId();
            Optional<Usuario> clienteOpt = usuarioService.obtenerPorId(clienteId);
            if (clienteOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cliente no encontrado.");
            }

            Usuario cliente = clienteOpt.get();
            reserva.setClienteOnline(cliente);

            if (reservaService.clienteTieneOtraReservaEnEseHorario(clienteId, inicio, duracion, null)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya tienes una reserva en ese horario.");
            }
        }

        // Buscar trabajadores disponibles
        List<Trabajador> disponibles = trabajadorService.obtenerTodos().stream()
                .filter(t -> !reservaService.estaTrabajadorOcupadoDurante(t, inicio, duracion, null))
                .toList();

        if (disponibles.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("No hay trabajadores disponibles para esa hora.");
        }

        Trabajador asignado = disponibles.get((int) (Math.random() * disponibles.size()));
        reserva.setTrabajador(asignado);

        Reserva nueva = reservaService.guardarReserva(reserva);
        return ResponseEntity.ok(nueva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarReserva(@PathVariable Long id, @RequestBody Reserva reserva) {
        reserva.setId(id);

        Long servicioId = reserva.getServicio().getId();
        Optional<Servicio> servicioOpt = servicioService.obtenerPorId(servicioId);
        if (servicioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Servicio no encontrado.");
        }

        Servicio servicio = servicioOpt.get();
        reserva.setServicio(servicio);
        LocalDateTime inicio = reserva.getFechaYHora();
        int duracion = servicio.getDuracion();

        if (reserva.getClienteOnline() != null) {
            Long clienteId = reserva.getClienteOnline().getId();
            Optional<Usuario> clienteOpt = usuarioService.obtenerPorId(clienteId);
            if (clienteOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cliente no encontrado.");
            }

            Usuario cliente = clienteOpt.get();
            reserva.setClienteOnline(cliente);

            if (reservaService.clienteTieneOtraReservaEnEseHorario(clienteId, inicio, duracion, id)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya tienes una reserva en ese horario.");
            }
        }

        // Buscar trabajadores disponibles (excluyendo el actual en edición)
        List<Trabajador> disponibles = trabajadorService.obtenerTodos().stream()
                .filter(t -> !reservaService.estaTrabajadorOcupadoDurante(t, inicio, duracion, id))
                .toList();

        if (disponibles.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Lo sentimos, no hay disponibilidad para la franja seleccionada ");
        }

        Trabajador asignado = disponibles.get((int) (Math.random() * disponibles.size()));
        reserva.setTrabajador(asignado);

        Reserva actualizada = reservaService.guardarReserva(reserva);
        return ResponseEntity.ok(actualizada);
    }

    @DeleteMapping("/{id}")
    public void eliminarReserva(@PathVariable Long id) {
        reservaService.eliminarReserva(id);
    }

    @GetMapping("/rango-fechas")
    public List<Reserva> obtenerReservasPorFecha(@RequestParam String inicio, @RequestParam String fin) {
        LocalDateTime startDate = LocalDateTime.parse(inicio);
        LocalDateTime endDate = LocalDateTime.parse(fin);
        return reservaService.obtenerReservasPorFecha(startDate, endDate);
    }

    @GetMapping("/cliente/{clienteId}")
    public List<Reserva> obtenerPorCliente(@PathVariable Long clienteId) {
        return reservaService.obtenerPorClienteId(clienteId);
    }

    @GetMapping("/semana")
    public List<Reserva> obtenerReservasSemana(@RequestParam String inicio, @RequestParam String fin) {
        LocalDateTime startDate = LocalDate.parse(inicio).atStartOfDay();
        LocalDateTime endDate = LocalDate.parse(fin).atTime(23, 59);
        return reservaService.obtenerReservasPorFecha(startDate, endDate);
    }

    @GetMapping("/trabajador/{trabajadorId}")
    public ResponseEntity<List<Reserva>> getReservasPorTrabajador(@PathVariable Long trabajadorId) {
        List<Reserva> reservas = reservaRepository.findByTrabajadorId(trabajadorId);
        return ResponseEntity.ok(reservas);
    }

}
