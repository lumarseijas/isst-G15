package com.reserva.controller;

import com.reserva.model.Reserva;
import com.reserva.model.Servicio;
import com.reserva.model.Trabajador;
import com.reserva.model.Usuario;
import com.reserva.service.ReservaService;
import com.reserva.service.ServicioService;
import com.reserva.service.TrabajadorService;
import com.reserva.service.UsuarioService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "*") // Permite acceso desde cualquier dominio
public class ReservaController {

    private final TrabajadorService trabajadorService;
    private final ReservaService reservaService;
    private final ServicioService servicioService;
    private final UsuarioService usuarioService;

    public ReservaController(ReservaService reservaService, TrabajadorService trabajadorService, ServicioService servicioService, UsuarioService usuarioService) {
        this.reservaService = reservaService;
        this.trabajadorService = trabajadorService;
        this.servicioService = servicioService;
        this.usuarioService = usuarioService;
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

        // 1. validar cliente
        if (reserva.getClienteOnline() != null) {
            Long clienteId = reserva.getClienteOnline().getId();
            Optional<Usuario> clienteOpt = usuarioService.obtenerPorId(clienteId);

            if (clienteOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cliente no encontrado.");
            }

            Usuario cliente = clienteOpt.get();
            reserva.setClienteOnline(cliente);

            // 2. Validar si ya tiene reserva en ese horario
            if (reservaService.clienteTieneReservaEnEseHorario(cliente, inicio, duracion)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya tienes una reserva en ese horario.");
            }
        }

        // 3. Buscar trabajador disponible  ---
        List<Trabajador> trabajadores = trabajadorService.obtenerTodos();
        for (Trabajador t : trabajadores) {
            boolean ocupado = reservaService.estaTrabajadorOcupadoDurante(t, inicio, duracion);
            if (!ocupado) {
                reserva.setTrabajador(t);
                Reserva nueva = reservaService.guardarReserva(reserva);
                return ResponseEntity.ok(nueva);
            }
        }

        return ResponseEntity.status(HttpStatus.CONFLICT).body("No hay trabajadores disponibles para esa hora.");

    }






    @PutMapping("/{id}")
    public Reserva actualizarReserva(@PathVariable Long id, @RequestBody Reserva reserva) {
        reserva.setId(id);
        return reservaService.guardarReserva(reserva);
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

}
