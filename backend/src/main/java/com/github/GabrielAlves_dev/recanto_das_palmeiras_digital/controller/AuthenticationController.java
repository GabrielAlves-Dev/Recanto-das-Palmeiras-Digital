package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.controller;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario.AuthenticationDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario.LoginResponseDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.service.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid AuthenticationDTO data) {
        LoginResponseDTO loginResponse = authenticationService.login(data);
        return ResponseEntity.ok(loginResponse);
    }
}