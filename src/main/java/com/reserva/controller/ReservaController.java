package com.reserva.controller;

import com.reserva.model.Reserva;
import com.reserva.service.ReservaService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "*") // Permite acceso desde cualquier dominio
public class ReservaController {

    private final ReservaService reservaService;

    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
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
    public Reserva crearReserva(@RequestBody Reserva reserva) {
        return reservaService.guardarReserva(reserva);
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
}
