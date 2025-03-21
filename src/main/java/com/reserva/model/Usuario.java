package com.reserva.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String telefono;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoUsuario tipo = TipoUsuario.CLIENTE_ONLINE; // Valor por defecto

    private String avatar;

    public enum TipoUsuario {
        ADMINISTRADOR, CLIENTE_ONLINE
    }
}
