package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.Produto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Produto> criarProduto(
            @RequestParam String nome,
            @RequestParam String descricao,
            @RequestParam BigDecimal preco,
            @RequestParam(required = false) BigDecimal precoRevenda,
            @RequestParam Integer quantidade,
            @RequestParam Boolean ativo,
            @RequestParam MultipartFile imagem) throws IOException {

        Produto produto = produtoService.salvarProduto(nome, descricao, preco, precoRevenda,
                quantidade, ativo, imagem);
        return ResponseEntity.status(HttpStatus.CREATED).body(produto);
    }
}
