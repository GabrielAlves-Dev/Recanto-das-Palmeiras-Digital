package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.controller;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.produto.Produto;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.produto.ProdutoMapper;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.produto.ProdutoRequestDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.produto.ProdutoResponseDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.service.ProdutoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @Autowired
    private ProdutoMapper produtoMapper;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> cadastrar(@ModelAttribute @Valid ProdutoRequestDTO dto) {
        UUID id = produtoService.salvarProduto(dto);
        URI location = URI.create("/produtos/" + id);
        return ResponseEntity.created(location).build();
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProdutoResponseDTO> atualizar(
            @PathVariable Integer id,
            @ModelAttribute @Valid ProdutoRequestDTO dto) {

        Produto atualizado = produtoService.atualizarProduto(id, dto);
        ProdutoResponseDTO response = produtoMapper.toProdutoResponseDTO(atualizado);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Void> alterarStatus(
            @PathVariable Integer id,
            @RequestParam boolean ativo) {
        produtoService.setAtivo(id, ativo);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Page<ProdutoResponseDTO>> listar(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) BigDecimal minPreco,
            @RequestParam(required = false) BigDecimal maxPreco,
            @RequestParam(required = false) Boolean ativo,
            @RequestParam(required = false) Boolean comEstoque,
            @PageableDefault(size = 10) Pageable pageable) {

        Page<Produto> pagina = produtoService.listar(nome, minPreco, maxPreco, ativo, comEstoque, pageable);
        Page<ProdutoResponseDTO> resposta = pagina.map(produtoMapper::toProdutoResponseDTO);
        return ResponseEntity.ok(resposta);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> buscarPorId(@PathVariable Integer id) {
        Produto produto = produtoService.findById(id);
        ProdutoResponseDTO dto = produtoMapper.toProdutoResponseDTO(produto);
        return ResponseEntity.ok(dto);
    }
}
