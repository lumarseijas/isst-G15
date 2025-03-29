package com.reserva.repository;

import com.reserva.model.Reserva;
import com.reserva.model.Trabajador;
import com.reserva.model.Usuario;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByFechaYHoraBetween(LocalDateTime start, LocalDateTime end);
    List<Reserva> findByTrabajadorAndFechaYHoraBetween(Trabajador trabajador, LocalDateTime desde, LocalDateTime hasta);
    boolean existsByTrabajadorAndFechaYHora(Trabajador trabajador, LocalDateTime fechaYHora);
    List<Reserva> findByClienteOnlineAndFechaYHoraBetween(Usuario clienteOnline, LocalDateTime desde, LocalDateTime hasta);
    List<Reserva> findByClienteOnlineId(Long clienteId);

}
