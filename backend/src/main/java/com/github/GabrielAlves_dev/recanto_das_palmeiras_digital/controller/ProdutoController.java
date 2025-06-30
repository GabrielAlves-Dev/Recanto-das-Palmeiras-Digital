package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.controller;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.produto.ProdutoMapper;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.produto.ProdutoRequestDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.produto.ProdutoResponseDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.produto.Produto;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.service.ProdutoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoMapper mapper;

    @Autowired
    private ProdutoService service;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProdutoResponseDTO> cadastrar(@ModelAttribute @Valid ProdutoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mapper.toProdutoResponseDTO(service.salvarProduto(mapper.toEntity(dto))));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProdutoResponseDTO> atualizar(
            @PathVariable Integer id,
            @ModelAttribute @Valid ProdutoRequestDTO dto) {
        return ResponseEntity.ok(mapper.toProdutoResponseDTO(service.atualizarProduto(id, dto)));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Void> alterarStatus(
            @PathVariable Integer id,
            @RequestParam boolean ativo) {
        service.setAtivo(id, ativo);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Page<ProdutoResponseDTO>> listar(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) BigDecimal minPreco,
            @RequestParam(required = false) BigDecimal maxPreco,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<Produto> page = service.listar(nome, minPreco, maxPreco, pageable);
        Page<ProdutoResponseDTO> dtoPage = page.map(mapper::toProdutoResponseDTO);
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> buscarPorId(@PathVariable Integer id) {
        Produto produto = service.findById(id);
        return ResponseEntity.ok(mapper.toProdutoResponseDTO(produto));
    }
}
