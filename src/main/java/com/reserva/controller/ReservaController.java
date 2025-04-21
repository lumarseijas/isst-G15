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
import com.reserva.service.DiaNoDisponibleService;
import com.reserva.service.EmailService;

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
    private final DiaNoDisponibleService diaNoDisponibleService;
    private final EmailService emailService;

    public ReservaController(ReservaService reservaService, TrabajadorService trabajadorService,
                             ServicioService servicioService, UsuarioService usuarioService,
                             ReservaRepository reservaRepository, DiaNoDisponibleService diaNoDisponibleService, EmailService emailService) {
        this.reservaService = reservaService;
        this.trabajadorService = trabajadorService;
        this.servicioService = servicioService;
        this.usuarioService = usuarioService;
        this.reservaRepository = reservaRepository;
        this.diaNoDisponibleService = diaNoDisponibleService;
        this.emailService = emailService;
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

        List<Trabajador> disponibles = trabajadorService.obtenerTodos().stream()
                .filter(t -> !reservaService.estaTrabajadorOcupadoDurante(t, inicio, duracion, null))
                .filter(t -> !diaNoDisponibleService.existeDiaLibre(t.getId(), inicio.toLocalDate()))
                .toList();

        if (disponibles.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("No hay trabajadores disponibles para esa hora.");
        }

        Trabajador asignado = disponibles.get((int) (Math.random() * disponibles.size()));
        reserva.setTrabajador(asignado);

        Reserva nueva = reservaService.guardarReserva(reserva);

        // ENVÍO DE CORREO DE CONFIRMACIÓN
        if (nueva.getClienteOnline() != null) {
            String email = nueva.getClienteOnline().getEmail();
            String nombre = nueva.getClienteOnline().getNombre();
            String servicioNombre = nueva.getServicio().getNombreServicio();
            LocalDateTime fechaYHora = nueva.getFechaYHora();

            String mensaje = String.format(
                "Hola %s,\n\nTu cita para el servicio de %s ha sido confirmada para el día %s a las %s.\n\nGracias por confiar en nosotros.",
                nombre,
                servicioNombre,
                fechaYHora.toLocalDate(),
                fechaYHora.toLocalTime()
            );

            emailService.enviarCorreo(
                email,
                "Confirmación de tu cita en Centro Belleza",
                mensaje
            );
        }

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

        List<Trabajador> disponibles = trabajadorService.obtenerTodos().stream()
                .filter(t -> !reservaService.estaTrabajadorOcupadoDurante(t, inicio, duracion, id))
                .filter(t -> !diaNoDisponibleService.existeDiaLibre(t.getId(), inicio.toLocalDate()))
                .toList();

        if (disponibles.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Lo sentimos, no hay disponibilidad para la franja seleccionada ");
        }

        Trabajador asignado = disponibles.get((int) (Math.random() * disponibles.size()));
        reserva.setTrabajador(asignado);

        Reserva actualizada = reservaService.guardarReserva(reserva);
        if (actualizada.getClienteOnline() != null) {
            String email = actualizada.getClienteOnline().getEmail();
            String nombre = actualizada.getClienteOnline().getNombre();
            String servicioNombre = actualizada.getServicio().getNombreServicio();
            LocalDateTime fechaYHora = actualizada.getFechaYHora();
        
            String mensaje = String.format(
                "Hola %s,\n\nTu cita para el servicio de %s ha sido modificada. La nueva fecha es el %s a las %s.\n\nSi no solicitaste este cambio o necesitas otra hora, por favor contáctanos.",
                nombre,
                servicioNombre,
                fechaYHora.toLocalDate(),
                fechaYHora.toLocalTime()
            );
        
            System.out.println("📨 Notificación de modificación enviada a: " + email);
            emailService.enviarCorreo(email, "Tu cita ha sido modificada", mensaje);
        }
        
        return ResponseEntity.ok(actualizada);
    }

    @DeleteMapping("/{id}")
public ResponseEntity<?> eliminarReserva(@PathVariable Long id) {
    Optional<Reserva> reservaOpt = reservaService.obtenerPorId(id);

    if (reservaOpt.isPresent()) {
        Reserva reserva = reservaOpt.get();
        reservaService.eliminarReserva(id);

        if (reserva.getClienteOnline() != null) {
            String email = reserva.getClienteOnline().getEmail();
            String nombre = reserva.getClienteOnline().getNombre();
            String servicioNombre = reserva.getServicio().getNombreServicio();
            LocalDateTime fechaYHora = reserva.getFechaYHora();

            String mensaje = String.format(
                "Hola %s,\n\nLamentamos informarte que tu cita para el servicio de %s programada para el día %s a las %s ha sido cancelada por el centro.\n\nPuedes hacer otra reserva en el horario que prefieras desde la web.",
                nombre,
                servicioNombre,
                fechaYHora.toLocalDate(),
                fechaYHora.toLocalTime()
            );

            System.out.println("📨 Notificación de cancelación enviada a: " + email);
            emailService.enviarCorreo(email, "Tu cita ha sido cancelada", mensaje);
        }

        return ResponseEntity.ok().build();
    }

    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reserva no encontrada.");
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
