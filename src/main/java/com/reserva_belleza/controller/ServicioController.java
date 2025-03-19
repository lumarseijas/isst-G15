package com.reserva_belleza.controller;

import com.reserva_belleza.model.Servicio;
import com.reserva_belleza.repository.ServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios")
public class ServicioController {

    @Autowired
    private ServicioRepository servicioRepository;

    @GetMapping
    public List<Servicio> getServicios() {
        return servicioRepository.findAll();
    }

    @PostMapping
    public Servicio crearServicio(@RequestBody Servicio servicio) {
        return servicioRepository.save(servicio);
    }
}