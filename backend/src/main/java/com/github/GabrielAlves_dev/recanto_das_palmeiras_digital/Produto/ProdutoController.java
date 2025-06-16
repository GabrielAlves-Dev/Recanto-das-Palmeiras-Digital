package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.Produto;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.Produto.dtos.ProdutoMapper;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.Produto.dtos.ProdutoRequestDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.Produto.dtos.ProdutoResponseDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoService service;

    @Autowired
    private ProdutoMapper mapper;

    @PostMapping
    public ResponseEntity<ProdutoResponseDTO> cadastrar(@Valid @RequestBody ProdutoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toProdutoResponseDTO(service.salvarProduto(mapper.toEntity(dto))));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> atualizar(
            @PathVariable Integer id,
            @Valid @RequestBody ProdutoRequestDTO dto) {
        return ResponseEntity.ok(
                mapper.toProdutoResponseDTO(
                        service.atualizarProduto(id, mapper.toEntity(dto))));
    }

    @PatchMapping("/{id}/ativo")
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
}
