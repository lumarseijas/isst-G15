package com.reserva.service;

import com.reserva.model.Trabajador;
import com.reserva.repository.TrabajadorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TrabajadorService {

    private final TrabajadorRepository trabajadorRepository;

    public TrabajadorService(TrabajadorRepository trabajadorRepository) {
        this.trabajadorRepository = trabajadorRepository;
    }

    public List<Trabajador> obtenerTodos() {
        return trabajadorRepository.findAll();
    }

    public Optional<Trabajador> obtenerPorId(Long id) {
        return trabajadorRepository.findById(id);
    }

    public Trabajador guardarTrabajador(Trabajador trabajador) {
        return trabajadorRepository.save(trabajador);
    }

    public void eliminarTrabajador(Long id) {
        trabajadorRepository.deleteById(id);
    }
}
