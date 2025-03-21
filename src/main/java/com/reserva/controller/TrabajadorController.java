package com.reserva.controller;

import com.reserva.model.Trabajador;
import com.reserva.service.TrabajadorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/trabajadores")
@CrossOrigin(origins = "*") // Permite acceso desde cualquier dominio
public class TrabajadorController {

    private final TrabajadorService trabajadorService;

    public TrabajadorController(TrabajadorService trabajadorService) {
        this.trabajadorService = trabajadorService;
    }

    @GetMapping
    public List<Trabajador> obtenerTodos() {
        return trabajadorService.obtenerTodos();
    }

    @GetMapping("/{id}")
    public Optional<Trabajador> obtenerPorId(@PathVariable Long id) {
        return trabajadorService.obtenerPorId(id);
    }

    @PostMapping
    public Trabajador crearTrabajador(@RequestBody Trabajador trabajador) {
        return trabajadorService.guardarTrabajador(trabajador);
    }

    @PutMapping("/{id}")
    public Trabajador actualizarTrabajador(@PathVariable Long id, @RequestBody Trabajador trabajador) {
        trabajador.setId(id);
        return trabajadorService.guardarTrabajador(trabajador);
    }

    @DeleteMapping("/{id}")
    public void eliminarTrabajador(@PathVariable Long id) {
        trabajadorService.eliminarTrabajador(id);
    }
}
