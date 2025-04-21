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
            .cors(cors -> {}) // Esto lo deja activado y usa lo definido en CorsConfig

            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() 
            )
            .oauth2Login(oauth2 -> oauth2
                .defaultSuccessUrl("/auth/success", true) // redirecciÃ³n tras login exitoso
            );
 
        return http.build();
    }
}