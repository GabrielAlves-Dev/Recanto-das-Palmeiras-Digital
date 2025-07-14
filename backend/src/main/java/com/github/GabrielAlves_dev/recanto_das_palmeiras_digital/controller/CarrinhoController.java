package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.controller;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.carrinho.CarrinhoItemRequestDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.carrinho.CarrinhoItemResponseDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.service.CarrinhoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/carrinho")
public class CarrinhoController {

    @Autowired
    private CarrinhoService carrinhoService;

    @GetMapping
    public ResponseEntity<List<CarrinhoItemResponseDTO>> getCarrinho() {
        return ResponseEntity.ok(carrinhoService.getCarrinho());
    }

    @PostMapping("/items")
    public ResponseEntity<CarrinhoItemResponseDTO> adicionarItem(@RequestBody @Valid CarrinhoItemRequestDTO requestDTO) {
        return ResponseEntity.ok(carrinhoService.adicionarItem(requestDTO));
    }

    @DeleteMapping("/items/{produtoId}")
    public ResponseEntity<Void> removerItem(@PathVariable UUID produtoId) {
        carrinhoService.removerItem(produtoId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> limparCarrinho() {
        carrinhoService.limparCarrinho();
        return ResponseEntity.noContent().build();
    }
}