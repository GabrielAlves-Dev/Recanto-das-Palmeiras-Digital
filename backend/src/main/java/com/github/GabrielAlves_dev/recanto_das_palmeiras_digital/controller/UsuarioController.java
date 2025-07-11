package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.controller;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario.AuthenticationDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario.UsuarioRequestDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario.UsuarioResponseDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario.UsuarioUpdateDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService service;

    @PostMapping
    public ResponseEntity<Void> cadastrar(@RequestBody @Valid UsuarioRequestDTO dto) {
        UUID id = service.cadastrar(dto);
        return ResponseEntity.created(URI.create("/usuarios/" + id)).build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<Page<UsuarioResponseDTO>> listar(@PageableDefault Pageable pageable) {
        return ResponseEntity.ok(service.listar(pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> editar(@PathVariable UUID id, @RequestBody @Valid UsuarioUpdateDTO dto) {
        service.editar(id, dto);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Void> alterarStatus(@PathVariable UUID id, @RequestParam boolean ativo) {
        service.alterarStatus(id, ativo);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<Void> login(@RequestBody @Valid AuthenticationDTO data){
        service.login(data);
        return ResponseEntity.noContent().build();
    }
}
