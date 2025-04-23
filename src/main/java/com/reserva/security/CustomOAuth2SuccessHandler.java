package com.reserva.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.reserva.model.Usuario;
import com.reserva.repository.UsuarioRepository;
import com.reserva.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String nombre = oAuth2User.getAttribute("name");
        String avatar = oAuth2User.getAttribute("picture");

        // Busca o crea el usuario
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        Usuario usuario = usuarioOpt.orElseGet(() -> {
            Usuario nuevo = new Usuario();
            nuevo.setEmail(email);
            nuevo.setNombre(nombre);
            nuevo.setAvatar(avatar);
            nuevo.setTipo(Usuario.TipoUsuario.CLIENTE_ONLINE); 
            return usuarioRepository.save(nuevo);
        });

        // Generar JWT
        String token = jwtService.generateToken(usuario);

        // Responder con JSON
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("token", token);
        responseBody.put("nombre", usuario.getNombre());
        responseBody.put("email", usuario.getEmail());

        response.setContentType("application/json");
        new ObjectMapper().writeValue(response.getWriter(), responseBody);
    }
}
