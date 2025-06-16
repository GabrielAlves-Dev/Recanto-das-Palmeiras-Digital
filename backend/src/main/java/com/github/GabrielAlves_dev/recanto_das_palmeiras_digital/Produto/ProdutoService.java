package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.Produto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class ProdutoService {

    @Value("${produto.imagem.diretorio:uploads}")
    private String diretorioUpload;

    @Autowired
    private ProdutoRepository produtoRepository;

    public Produto salvarProduto(String nome, String descricao, BigDecimal preco,
                                 BigDecimal precoRevenda, Integer quantidade,
                                 Boolean ativo, MultipartFile imagem) throws IOException {

        String nomeImagem = UUID.randomUUID() + "_" + imagem.getOriginalFilename();
        Path path = Paths.get(diretorioUpload).resolve(nomeImagem);
        Files.createDirectories(path.getParent());
        Files.copy(imagem.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

        Produto produto = new Produto();
        System.out.println("antes");
        produto.setNome(nome);
        System.out.println("depois");
        produto.setDescricao(descricao);
        produto.setPreco(preco);
        produto.setPrecoRevenda(precoRevenda);
        produto.setQuantidade(quantidade);
        produto.setAtivo(ativo);
        produto.setImagem(path.toString());

        return produtoRepository.save(produto);
    }
}

