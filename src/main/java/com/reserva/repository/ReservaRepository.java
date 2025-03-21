package com.reserva.repository;

import com.reserva.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByFechaYHoraBetween(LocalDateTime start, LocalDateTime end);
}
