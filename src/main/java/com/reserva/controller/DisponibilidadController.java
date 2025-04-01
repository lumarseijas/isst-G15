package com.reserva.controller;

import com.reserva.model.Reserva;
import com.reserva.model.Servicio;
import com.reserva.model.Trabajador;
import com.reserva.service.ReservaService;
import com.reserva.service.ServicioService;
import com.reserva.service.TrabajadorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api")
public class DisponibilidadController {

    @Autowired
    private ReservaService reservaService;

    @Autowired
    private ServicioService servicioService;

    @Autowired
    private TrabajadorService trabajadorService;

    @GetMapping("/disponibilidad")
    public ResponseEntity<List<String>> obtenerHorasDisponibles(
            @RequestParam String fecha,
            @RequestParam Long servicioId) {

        LocalDate fechaSeleccionada = LocalDate.parse(fecha);
        Servicio servicio = servicioService.findById(servicioId);
        int duracionMin = servicio.getDuracion(); // en minutos

        List<String> horas = generarIntervalosDe15Minutos();

        List<Trabajador> trabajadores = trabajadorService.findAll();
        List<Reserva> reservasDelDia = reservaService.findByFecha(fechaSeleccionada);

        List<String> horasDisponibles = horas.stream()
            .filter(hora -> hayAlgunTrabajadorDisponible(fechaSeleccionada, hora, duracionMin, trabajadores, reservasDelDia))
            .collect(Collectors.toList());

        return ResponseEntity.ok(horasDisponibles);
    }

    private List<String> generarIntervalosDe15Minutos() {
        List<String> horas = new ArrayList<>();
        LocalTime inicio = LocalTime.of(9, 0);
        LocalTime fin = LocalTime.of(21, 0);

        while (!inicio.isAfter(fin.minusMinutes(15))) {
            horas.add(inicio.format(DateTimeFormatter.ofPattern("HH:mm")));
            inicio = inicio.plusMinutes(15);
        }
        return horas;
    }

    private boolean hayAlgunTrabajadorDisponible(LocalDate fecha, String horaStr, int duracionMin,
                                                 List<Trabajador> trabajadores, List<Reserva> reservas) {
        LocalTime horaInicio = LocalTime.parse(horaStr);
        LocalTime horaFin = horaInicio.plusMinutes(duracionMin);

        for (Trabajador t : trabajadores) {
            boolean ocupado = reservas.stream().anyMatch(r -> 
                r.getTrabajador().getId().equals(t.getId()) &&
                solapa(horaInicio, horaFin, r.getFechaYHora().toLocalTime(), 
                                          r.getFechaYHora().toLocalTime().plusMinutes(r.getServicio().getDuracion()))
            );
            if (!ocupado) return true; // si al menos uno libre, esa hora es válida
        }
        return false;
    }

    private boolean solapa(LocalTime inicio1, LocalTime fin1, LocalTime inicio2, LocalTime fin2) {
        return !(fin1.isBefore(inicio2) || inicio1.isAfter(fin2));
    }
}
