package com.reserva.repository;

import com.reserva.model.DiaNoDisponible;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DiaNoDisponibleRepository extends JpaRepository<DiaNoDisponible, Long> {
    List<DiaNoDisponible> findByTrabajadorId(Long trabajadorId);
    boolean existsByTrabajadorIdAndFecha(Long trabajadorId, LocalDate fecha);
}
