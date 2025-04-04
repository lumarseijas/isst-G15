package com.reserva.service;

import com.reserva.repository.DiaNoDisponibleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.LocalDate;

@Service
public class DiaNoDisponibleService {

    @Autowired
    private DiaNoDisponibleRepository diaNoDisponibleRepository;

    public boolean existeDiaLibre(Long trabajadorId, LocalDate fecha) {
    return diaNoDisponibleRepository.existsByTrabajadorIdAndFecha(trabajadorId, fecha);
}

}
