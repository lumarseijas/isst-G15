package com.reserva.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173")); // ðŸ”¹ Permitir el frontend
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // ðŸ”¹ MÃ©todos permitidos
        config.setAllowedHeaders(List.of("*")); // ðŸ”¹ Permitir todos los headers
        config.setAllowCredentials(true); // ðŸ”¹ Permitir credenciales (cookies, autenticaciÃ³n)

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // ðŸ”¹ Aplicar a todas las rutas
        return new CorsFilter(source);
    }
}
