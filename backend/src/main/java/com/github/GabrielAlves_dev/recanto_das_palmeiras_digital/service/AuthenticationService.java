package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.service;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.cliente.Cliente;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario.AuthenticationDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario.LoginResponseDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    public LoginResponseDTO login(AuthenticationDTO data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.getEmail(), data.getSenha());
        Authentication auth = this.authenticationManager.authenticate(usernamePassword);

        String token;
        Object principal = auth.getPrincipal();

        if (principal instanceof Usuario) {
            token = tokenService.generateToken((Usuario) principal);
        } else if (principal instanceof Cliente) {
            token = tokenService.generateToken((Cliente) principal);
        } else {
            throw new RuntimeException("Unknown user type after authentication.");
        }

        return new LoginResponseDTO(token);
    }
}