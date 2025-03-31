package com.reserva.service;

import com.reserva.model.Reserva;
import com.reserva.model.Trabajador;
import com.reserva.model.Usuario;
import com.reserva.repository.ReservaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReservaService {

    private final ReservaRepository reservaRepository;

    public ReservaService(ReservaRepository reservaRepository) {
        this.reservaRepository = reservaRepository;
    }

    public List<Reserva> obtenerTodas() {
        return reservaRepository.findAll();
    }

    public Optional<Reserva> obtenerPorId(Long id) {
        return reservaRepository.findById(id);
    }

    public Reserva guardarReserva(Reserva reserva) {
        return reservaRepository.save(reserva);
    }

    public void eliminarReserva(Long id) {
        reservaRepository.deleteById(id);
    }

    public List<Reserva> obtenerReservasPorFecha(LocalDateTime inicio, LocalDateTime fin) {
        return reservaRepository.findByFechaYHoraBetween(inicio, fin);
    }

    public boolean estaTrabajadorOcupado(Trabajador trabajador, LocalDateTime fechaYHora) {
    return reservaRepository.existsByTrabajadorAndFechaYHora(trabajador, fechaYHora);
    }

    /*public boolean estaTrabajadorOcupadoDurante(Trabajador trabajador, LocalDateTime inicio, int duracionMinutos) {
        LocalDateTime fin = inicio.plusMinutes(duracionMinutos);
        List<Reserva> reservas = reservaRepository.findByTrabajadorAndFechaYHoraBetween(trabajador, inicio.minusMinutes(duracionMinutos), fin);
    
        for (Reserva r : reservas) {
            LocalDateTime inicioExistente = r.getFechaYHora();
            LocalDateTime finExistente = inicioExistente.plusMinutes(r.getServicio().getDuracion());
    
            boolean haySolapamiento = inicio.isBefore(finExistente) && fin.isAfter(inicioExistente);
            if (haySolapamiento) return true;
        }
        return false;
    }*/
    public boolean estaTrabajadorOcupadoDurante(Trabajador trabajador, LocalDateTime inicio, int duracion, Long reservaActualId) {
        List<Reserva> reservas = reservaRepository.findByTrabajador(trabajador);
    
        LocalDateTime fin = inicio.plusMinutes(duracion);
    
        for (Reserva r : reservas) {
            if (r.getId().equals(reservaActualId)) continue; // no comparar con la misma reserva
            LocalDateTime rInicio = r.getFechaYHora();
            LocalDateTime rFin = rInicio.plusMinutes(r.getServicio().getDuracion());
    
            if (inicio.isBefore(rFin) && fin.isAfter(rInicio)) {
                return true;
            }
        }
        return false;
    }
    /**//*/* */ 
    


    public boolean clienteTieneSolapamiento(Usuario cliente, LocalDateTime inicio, int duracionMinutos) {
    LocalDateTime fin = inicio.plusMinutes(duracionMinutos);
    List<Reserva> reservas = reservaRepository.findByClienteOnlineAndFechaYHoraBetween(cliente, inicio.minusMinutes(duracionMinutos), fin);

    for (Reserva r : reservas) {
        LocalDateTime inicioExistente = r.getFechaYHora();
        LocalDateTime finExistente = inicioExistente.plusMinutes(r.getServicio().getDuracion());

        boolean haySolapamiento = inicio.isBefore(finExistente) && fin.isAfter(inicioExistente);
        if (haySolapamiento) return true;
    }
    return false;
}

/*public boolean clienteTieneReservaEnEseHorario(Usuario cliente, LocalDateTime inicio, int duracionMinutos) {
    LocalDateTime fin = inicio.plusMinutes(duracionMinutos);
    List<Reserva> reservasCliente = reservaRepository.findByClienteOnlineAndFechaYHoraBetween(cliente, inicio.minusMinutes(duracionMinutos), fin);

    for (Reserva r : reservasCliente) {
        LocalDateTime inicioExistente = r.getFechaYHora();
        LocalDateTime finExistente = inicioExistente.plusMinutes(r.getServicio().getDuracion());

        boolean haySolapamiento = inicio.isBefore(finExistente) && fin.isAfter(inicioExistente);
        if (haySolapamiento) return true;
    }
    return false;
}*/
public boolean clienteTieneOtraReservaEnEseHorario(Long clienteId, LocalDateTime inicio, int duracion, Long reservaActualId) {
    List<Reserva> reservas = reservaRepository.findByClienteOnlineId(clienteId);
    LocalDateTime fin = inicio.plusMinutes(duracion);

    for (Reserva r : reservas) {
        if (r.getId().equals(reservaActualId)) continue;
        LocalDateTime rInicio = r.getFechaYHora();
        LocalDateTime rFin = rInicio.plusMinutes(r.getServicio().getDuracion());

        if (inicio.isBefore(rFin) && fin.isAfter(rInicio)) {
            return true;
        }
    }
    return false;
}/* */


public List<Reserva> obtenerPorClienteId(Long clienteId) {
    return reservaRepository.findByClienteOnlineId(clienteId);
}



    

}
