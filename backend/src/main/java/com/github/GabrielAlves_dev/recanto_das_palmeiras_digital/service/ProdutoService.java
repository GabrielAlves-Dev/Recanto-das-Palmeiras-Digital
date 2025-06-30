package com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.service;

import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.repository.ProdutoRepository;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.specifications.ProdutoSpecification;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.produto.dto.ProdutoRequestDTO;
import com.github.GabrielAlves_dev.recanto_das_palmeiras_digital.domain.produto.Produto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository repo;

    @Autowired
    private StorageService storageService;

    public Produto salvarProduto(Produto produto) {
        return repo.save(produto);
    }

    public Produto atualizarProduto(Integer id, ProdutoRequestDTO dto) {
        Produto existente = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado: " + id));

        existente.setNome(dto.getNome());
        existente.setDescricao(dto.getDescricao());
        existente.setPreco(dto.getPreco());
        existente.setQuantidade(dto.getQuantidade());

        MultipartFile novaImagem = dto.getImagem();
        if (novaImagem != null && !novaImagem.isEmpty()) {
            if (existente.getImagem() != null) {
                storageService.deletarImagem(existente.getImagem());
            }

            String caminhoImagem = storageService.salvarImagem(novaImagem);
            existente.setImagem(caminhoImagem);
        }

        return repo.save(existente);
    }


    public void setAtivo(Integer id, boolean ativo) {
        Produto existente = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado: " + id));
        existente.setAtivo(ativo);
        repo.save(existente);
    }

    public Page<Produto> listar(String nome, BigDecimal minPreco, BigDecimal maxPreco,
                                Pageable pageable) {
        List<Specification<Produto>> filtros = new ArrayList<>();

        if (nome != null && !nome.isBlank()) {
            filtros.add(ProdutoSpecification.porNome(nome));
        }
        if (minPreco != null || maxPreco != null) {
            filtros.add(ProdutoSpecification.porPrecoEntre(minPreco, maxPreco));
        }

        Specification<Produto> spec = filtros.stream()
                .reduce(Specification::and)
                .orElse(null);

        return repo.findAll(spec, pageable);
    }

    public Produto findById(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado: " + id));
    }
}