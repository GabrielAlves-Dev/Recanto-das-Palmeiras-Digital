package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.controller;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.pedido.PedidoRequestDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.pedido.PedidoResponseDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.pedido.StatusPedido;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.service.PedidoService;
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
@RequestMapping("/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<PedidoResponseDTO> criarPedido(@RequestBody @Valid PedidoRequestDTO dto) {
        PedidoResponseDTO responseDTO = pedidoService.criarPedido(dto);
        URI location = URI.create("/pedidos/" + responseDTO.getId());
        return ResponseEntity.created(location).body(responseDTO);
    }

    @GetMapping
    public ResponseEntity<Page<PedidoResponseDTO>> listarPedidos(@PageableDefault(size = 10, sort = "dataPedido") Pageable pageable) {
        Page<PedidoResponseDTO> pagina = pedidoService.listarTodos(pageable);
        return ResponseEntity.ok(pagina);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponseDTO> buscarPedidoPorId(@PathVariable UUID id) {
        PedidoResponseDTO responseDTO = pedidoService.buscarPorId(id);
        return ResponseEntity.ok(responseDTO);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<PedidoResponseDTO> atualizarStatus(
            @PathVariable UUID id,
            @RequestParam("status") StatusPedido novoStatus) {
        PedidoResponseDTO responseDTO = pedidoService.atualizarStatus(id, novoStatus);
        return ResponseEntity.ok(responseDTO);
    }

    @PostMapping("/{id}/cancelar")
    public ResponseEntity<PedidoResponseDTO> cancelarPedido(@PathVariable UUID id) {
        PedidoResponseDTO responseDTO = pedidoService.cancelarPedido(id);
        return ResponseEntity.ok(responseDTO);
    }
}