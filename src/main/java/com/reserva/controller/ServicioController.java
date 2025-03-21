package com.reserva.controller;

import com.reserva.model.Servicio;
import com.reserva.service.ServicioService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/servicios")
@CrossOrigin(origins = "*") // Permite acceso desde cualquier dominio
public class ServicioController {

    private final ServicioService servicioService;

    public ServicioController(ServicioService servicioService) {
        this.servicioService = servicioService;
    }

    @GetMapping
    public List<Servicio> obtenerTodos() {
        return servicioService.obtenerTodos();
    }

    @GetMapping("/{id}")
    public Optional<Servicio> obtenerPorId(@PathVariable Long id) {
        return servicioService.obtenerPorId(id);
    }

    @PostMapping
    public Servicio crearServicio(@RequestBody Servicio servicio) {
        return servicioService.guardarServicio(servicio);
    }

    @PutMapping("/{id}")
    public Servicio actualizarServicio(@PathVariable Long id, @RequestBody Servicio servicio) {
        servicio.setId(id);
        return servicioService.guardarServicio(servicio);
    }

    @DeleteMapping("/{id}")
    public void eliminarServicio(@PathVariable Long id) {
        servicioService.eliminarServicio(id);
    }
}
