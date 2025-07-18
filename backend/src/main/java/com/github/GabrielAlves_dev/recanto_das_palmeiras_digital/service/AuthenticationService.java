package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.service;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.cliente.Cliente;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario.AuthenticationDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario.LoginResponseDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    public LoginResponseDTO login(AuthenticationDTO dto) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getSenha());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        Object principal = auth.getPrincipal();

        String token;
        if (principal instanceof Usuario) {
            token = tokenService.generateToken((Usuario) principal);
            return new LoginResponseDTO(token, ((Usuario) principal).getCargo());
        } else if (principal instanceof Cliente) {
            token = tokenService.generateToken((Cliente) principal);
            return new LoginResponseDTO(token, null);
        } else {
            // Isso não deve acontecer se o AuthorizationService estiver correto
            throw new BadCredentialsException("Tipo de usuário desconhecido.");
        }
    }
}