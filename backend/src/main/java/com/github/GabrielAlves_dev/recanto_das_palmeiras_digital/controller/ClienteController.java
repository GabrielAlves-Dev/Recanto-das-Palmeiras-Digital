package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.controller;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.cliente.ClienteAutoCadastroDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.cliente.ClienteRequestDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.cliente.ClienteResponseDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario.AuthenticationDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.usuario.LoginResponseDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.service.ClienteService;
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
@RequestMapping("/clientes")
public class ClienteController {

    @Autowired
    private ClienteService service;

    // RF008 - Auto Cadastro
    @PostMapping("/auto-cadastro")
    public ResponseEntity<Void> autoCadastrar(@RequestBody @Valid ClienteAutoCadastroDTO dto) {
        UUID id = service.autoCadastrar(dto);
        return ResponseEntity.created(URI.create("/clientes/" + id)).build();
    }

    // RF012 - Cadastro por gerente/vendedor
    @PostMapping
    public ResponseEntity<Void> cadastrar(@RequestBody @Valid ClienteRequestDTO dto) {
        UUID id = service.cadastrarPorGerente(dto);
        return ResponseEntity.created(URI.create("/clientes/" + id)).build();
    }

    // RF009 - Ver dados
    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    // RF010 / RF013 - Editar
    @PutMapping("/{id}")
    public ResponseEntity<Void> editar(@PathVariable UUID id, @RequestBody ClienteRequestDTO dto) {
        service.editar(id, dto);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/ativar")
    public ResponseEntity<Void> ativar(@PathVariable UUID id) {
        service.ativar(id);
        return ResponseEntity.noContent().build();
    }

    // RF011 / RF014 - Desativar conta
    @PatchMapping("/{id}/desativar")
    public ResponseEntity<Void> desativar(@PathVariable UUID id) {
        service.desativar(id);
        return ResponseEntity.noContent().build();
    }

    // RF015 - Listar paginado
    @GetMapping
    public ResponseEntity<Page<ClienteResponseDTO>> listar(@PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(service.listar(pageable));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid AuthenticationDTO data){
        return ResponseEntity.ok(service.login(data));
    }
}