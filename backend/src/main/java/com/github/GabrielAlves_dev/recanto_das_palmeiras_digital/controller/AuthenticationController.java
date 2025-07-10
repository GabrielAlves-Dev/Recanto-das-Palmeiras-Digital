package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario.AuthenticationDTO;

import jakarta.validation.Valid;
import lombok.var;

@RestController
@RequestMapping("auth")
public class AuthenticationController {
    public ResponseEntity login(@RequestBody @Valid AuthenticationDTO data){
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.getEmail(), data.getSenha());
    }
}
