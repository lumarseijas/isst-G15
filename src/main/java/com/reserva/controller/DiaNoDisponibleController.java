package com.reserva.controller;

import com.reserva.model.DiaNoDisponible;
import com.reserva.model.Trabajador;
import com.reserva.repository.DiaNoDisponibleRepository;
import com.reserva.repository.TrabajadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/dias-no-disponibles")
@CrossOrigin(origins = "*")
public class DiaNoDisponibleController {

    @Autowired
    private DiaNoDisponibleRepository diaRepo;

    @Autowired
    private TrabajadorRepository trabajadorRepo;

    @GetMapping("/{trabajadorId}")
    public ResponseEntity<List<DiaNoDisponible>> obtenerDias(@PathVariable Long trabajadorId) {
        return ResponseEntity.ok(diaRepo.findByTrabajadorId(trabajadorId));
    }

    @PostMapping
    public ResponseEntity<?> crearDiaNoDisponible(@RequestBody DiaNoDisponibleDTO dto) {
        if (diaRepo.existsByTrabajadorIdAndFecha(dto.trabajadorId(), dto.fecha())) {
            return ResponseEntity.badRequest().body("Ya existe ese día libre para este trabajador.");
        }

        Trabajador t = trabajadorRepo.findById(dto.trabajadorId())
            .orElseThrow(() -> new RuntimeException("Trabajador no encontrado"));

        DiaNoDisponible dia = new DiaNoDisponible();
        dia.setTrabajador(t);
        dia.setFecha(dto.fecha());

        diaRepo.save(dia);
        return ResponseEntity.ok("Día no disponible registrado.");
    }

    public record DiaNoDisponibleDTO(Long trabajadorId, LocalDate fecha) {}
}

