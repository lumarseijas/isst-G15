package com.reserva.service;

import com.reserva.model.Reserva;
import com.reserva.model.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class RecordatorioScheduler {
    public RecordatorioScheduler() {
        System.out.println("✅ RecordatorioScheduler cargado correctamente por Spring.");
    }


    @Autowired
    private ReservaService reservaService;

    @Autowired
    private EmailService emailService;

    // Se ejecuta todos los días a las 9:00 de la mañana
    @Scheduled(cron = "0 0 9 * * *")
   //@Scheduled(cron = "0 */1 * * * *") // cada minuto
    public void enviarRecordatorios() {
        System.out.println("Recordatorio ejecutado " + java.time.LocalDateTime.now());
        LocalDateTime inicio = LocalDateTime.now().plusDays(1).withHour(0).withMinute(0);
        LocalDateTime fin = inicio.withHour(23).withMinute(59);

        List<Reserva> reservasDeManana = reservaService.obtenerReservasPorFecha(inicio, fin);

        for (Reserva r : reservasDeManana) {
            Usuario cliente = r.getClienteOnline();
            if (cliente != null && cliente.getEmail() != null) {
                String mensaje = String.format(
                    "Hola %s,\n\nTe recordamos que tienes una cita mañana a las %s para el servicio de %s.\n\n¡Te esperamos!",
                    cliente.getNombre(),
                    r.getFechaYHora().toLocalTime(),
                    r.getServicio().getNombreServicio()
                );

                System.out.println("Enviando recordatorio a: " + cliente.getEmail());
                emailService.enviarCorreo(
                    cliente.getEmail(),
                    "Recordatorio: cita mañana en Centro Belleza",
                    mensaje
                );
            }
        }
    }
}
