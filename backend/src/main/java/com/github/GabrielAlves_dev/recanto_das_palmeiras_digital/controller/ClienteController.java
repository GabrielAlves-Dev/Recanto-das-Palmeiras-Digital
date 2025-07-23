package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.controller;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.cliente.ClienteAutoCadastroDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.cliente.ClienteRequestDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.cliente.ClienteResponseDTO;
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

    @PostMapping("/auto-cadastro")
    public ResponseEntity<Void> autoCadastrar(@RequestBody @Valid ClienteAutoCadastroDTO dto) {
        UUID id = service.autoCadastrar(dto);
        return ResponseEntity.created(URI.create("/clientes/" + id)).build();
    }

    @GetMapping("/me")
    public ResponseEntity<ClienteResponseDTO> buscarMeuPerfil() {
        return ResponseEntity.ok(service.buscarPorClienteAutenticado());
    }

    @PutMapping("/me")
    public ResponseEntity<Void> editarMeuPerfil(@RequestBody @Valid ClienteRequestDTO dto) {
        service.editarClienteAutenticado(dto);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<Void> cadastrar(@RequestBody @Valid ClienteRequestDTO dto) {
        UUID id = service.cadastrarPorGerente(dto);
        return ResponseEntity.created(URI.create("/clientes/" + id)).build();
    }

    @GetMapping
    public ResponseEntity<Page<ClienteResponseDTO>> listar(
            @PageableDefault(size = 10) Pageable pageable,
            @RequestParam(required = false) String searchTerm
    ) {
        return ResponseEntity.ok(service.listar(pageable, searchTerm));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> editar(@PathVariable UUID id, @RequestBody @Valid ClienteRequestDTO dto) {
        service.editar(id, dto);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/ativar")
    public ResponseEntity<Void> ativar(@PathVariable UUID id) {
        service.ativar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/desativar")
    public ResponseEntity<Void> desativar(@PathVariable UUID id) {
        service.desativar(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> desativarContaPropria() {
        service.desativarContaPropria();
        return ResponseEntity.noContent().build();
    }
}