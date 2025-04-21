package com.reserva.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarCorreo(String destino, String asunto, String contenido) {
        System.out.println("Intentando enviar correo a: " + destino);
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(destino);
        mensaje.setSubject(asunto);
        mensaje.setText(contenido);
        mensaje.setFrom("centrobelleza2025@gmail.com"); // igual que el de configuración

        mailSender.send(mensaje);
        System.out.println("Correo enviado a: " + destino);
    }
}
