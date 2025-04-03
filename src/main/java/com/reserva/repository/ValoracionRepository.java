package com.reserva.repository;

import com.reserva.model.Valoracion;
import com.reserva.model.Reserva;
import com.reserva.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ValoracionRepository extends JpaRepository<Valoracion, Long> {

    // Buscar valoraciones por usuario
    List<Valoracion> findByUsuario(Usuario usuario);

    // Buscar valoraciones por reserva
    Valoracion findByReserva(Reserva reserva);

    // Buscar todas las valoraciones de un servicio (para media de estrellas, etc.)
    List<Valoracion> findByServicioId(Long servicioId);
}
