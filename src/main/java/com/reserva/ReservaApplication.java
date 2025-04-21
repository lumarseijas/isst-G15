package com.reserva;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ReservaApplication {
    public static void main(String[] args) {
        SpringApplication.run(ReservaApplication.class, args);
    }
}
