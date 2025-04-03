package com.reserva.service;

import com.reserva.model.Valoracion;
import com.reserva.model.Reserva;
import com.reserva.model.Usuario;
import com.reserva.repository.ValoracionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ValoracionService {

    @Autowired
    private ValoracionRepository valoracionRepository;

    public Valoracion guardarValoracion(Valoracion valoracion) {
        return valoracionRepository.save(valoracion);
    }

    public List<Valoracion> obtenerValoracionesDeUsuario(Usuario usuario) {
        return valoracionRepository.findByUsuario(usuario);
    }

    public Optional<Valoracion> obtenerValoracionPorReserva(Reserva reserva) {
        return Optional.ofNullable(valoracionRepository.findByReserva(reserva));
    }

    public List<Valoracion> obtenerValoracionesPorServicio(Long servicioId) {
        return valoracionRepository.findByServicioId(servicioId);
    }

    public void eliminarValoracion(Long id) {
        valoracionRepository.deleteById(id);
    }
}
