package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario.AuthenticationDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario.RegisterDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario.Usuario;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.repository.UsuarioRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("auth")
public class AuthenticationController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UsuarioRepository repository;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid AuthenticationDTO data){
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.getEmail(), data.getSenha());
        var auth = this.authenticationManager.authenticate(usernamePassword);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody @Valid RegisterDTO data) {
        if (this.repository.findByEmail(data.getEmail()) != null) return ResponseEntity.badRequest().build();

        String encryptedPassword = new BCryptPasswordEncoder().encode(data.getSenha());
        Usuario novoUsuario = new Usuario(data.getEmail(), encryptedPassword, data.getCargo());

        this.repository.save(novoUsuario);
        return ResponseEntity.ok().build();
    }
    
}
