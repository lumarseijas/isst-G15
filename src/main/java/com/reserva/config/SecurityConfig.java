package com.reserva.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.disable()) // 🔹 CORS ya se maneja en CorsConfig
            .csrf(csrf -> csrf.disable()) // 🔹 Deshabilita CSRF para facilitar pruebas
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/**").permitAll() // 🔹 Permitir todas las rutas de API
                .anyRequest().authenticated()
            )
            .formLogin(login -> login.disable()) // 🔹 Deshabilita formulario de login por ahora
            .httpBasic(httpBasic -> httpBasic.disable()); // 🔹 Deshabilita autenticación básica

        return http.build();
    }
}
