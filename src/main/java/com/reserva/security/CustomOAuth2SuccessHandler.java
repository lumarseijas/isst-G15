package com.reserva.security;
 
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
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
 
@Component
@RequiredArgsConstructor
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {
 
    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;
 
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                         Authentication authentication) throws IOException, ServletException {
             System.out.println("🎯 Entrando en onAuthenticationSuccess");
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
 
        String email = oAuth2User.getAttribute("email");
        String nombre = oAuth2User.getAttribute("name");
        String avatar = oAuth2User.getAttribute("picture");

        System.out.println("✅ Datos obtenidos de Google:");
        System.out.println("Email: " + email);
        System.out.println("Nombre: " + nombre);
        System.out.println("Avatar: " + avatar);

        // Busca o crea el usuario
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        Usuario usuario = usuarioOpt.orElseGet(() -> {
            System.out.println("🆕 Usuario no encontrado. Creando nuevo usuario...");
            Usuario nuevo = new Usuario();
            nuevo.setEmail(email);
            nuevo.setNombre(nombre);
            nuevo.setAvatar(avatar);
            nuevo.setTipo(Usuario.TipoUsuario.CLIENTE_ONLINE);
            return usuarioRepository.save(nuevo);
        });
        System.out.println("🏷️ Usuario final: " + usuario.getEmail() + ", " + usuario.getNombre());
        // Generar JWT
        String token = jwtService.generateToken(usuario);
        System.out.println("🔑 Token JWT generado: " + token);
        // Redirigir al frontend con los datos en la URL
        String redirectUrl = "http://localhost:5173/oauth2/redirect" +
                "?id=" + usuario.getId() +
                "&nombre=" + URLEncoder.encode(usuario.getNombre(), StandardCharsets.UTF_8) +
                "&email=" + URLEncoder.encode(usuario.getEmail(), StandardCharsets.UTF_8) +
                "&token=" + URLEncoder.encode(token, StandardCharsets.UTF_8);
            System.out.println("➡️ Redirigiendo a: " + redirectUrl);
        response.sendRedirect(redirectUrl);
    }
}